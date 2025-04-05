import React, { useState, useEffect } from 'react';
import '../Components/Chat.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { ref, get, onValue } from "firebase/database";
import { database, auth } from "./firebase";
import { sendChatMessage } from "./chat";
import Loading from "./loding";
import beginChat from "../Assets/begin_chat.png";

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const currentUser = auth.currentUser;
  const computedSenderId = state.senderId || (currentUser ? currentUser.uid : null);
  const computedSenderName = state.senderName || (currentUser ? currentUser.displayName : computedSenderId);

  const [searchQuery, setSearchQuery] = useState("");
  const [chatList, setChatList] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!computedSenderId) return;
    const chatListRef = ref(database, `ChatList/${computedSenderId}`);
    const unsubscribe = onValue(chatListRef, (snapshot) => {
      const fetchList = async () => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const entries = await Promise.all(
            Object.keys(data).map(async (rId) => {
              const chatEntry = data[rId];
              const userRef = ref(database, `users/${rId}`);
              const userSnapshot = await get(userRef);
              const userData = userSnapshot.exists() ? userSnapshot.val() : {};
              const finalName = userData.name || chatEntry.receiverName || rId;
              return {
                receiverId: rId,
                receiverName: finalName,
                lastUpdated: chatEntry.lastUpdated,
              };
            })
          );
          setChatList(entries);
        } else {
          setChatList([]);
        }
        setLoadingChats(false);
      };
      fetchList();
    });
    return () => unsubscribe();
  }, [computedSenderId]);

  useEffect(() => {
    if (!computedSenderId || !selectedChat) return;
    const chatsRef = ref(database, "Chats");
    const unsubscribeMessages = onValue(chatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let msgs = [];
        Object.keys(data).forEach(key => {
          const msgData = data[key];
          if (
            (msgData.senderId === computedSenderId && msgData.receiverId === selectedChat.receiverId) ||
            (msgData.senderId === selectedChat.receiverId && msgData.receiverId === computedSenderId)
          ) {
            msgs.push(msgData);
          }
        });
        msgs.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribeMessages();
  }, [computedSenderId, selectedChat]);

  const fetchChatMessages = async (senderId, receiverId) => {
    const chatsRef = ref(database, "Chats");
    const snapshot = await get(chatsRef);
    let msgs = [];
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(data).forEach(key => {
        const msgData = data[key];
        if (
          (msgData.senderId === senderId && msgData.receiverId === receiverId) ||
          (msgData.senderId === receiverId && msgData.receiverId === senderId)
        ) {
          msgs.push(msgData);
        }
      });
      msgs.sort((a, b) => a.timestamp - b.timestamp);
    }
    return msgs;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    const msgs = await fetchChatMessages(computedSenderId, chat.receiverId);
    setMessages(msgs);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage === "" || !selectedChat) return;
    const safeSenderName = computedSenderName || "Unknown";
    const safeReceiverName = selectedChat.receiverName || "Unknown";
    const messageData = await sendChatMessage(
      computedSenderId,
      safeSenderName,
      selectedChat.receiverId,
      safeReceiverName,
      trimmedMessage
    );
    setMessages([...messages, messageData]);
    setNewMessage("");
  };

  return (
    <div>
      <div className="redlabel"></div>
      <div className="navbar_lost">
        <div className="home_nav" onClick={() => handleNavigation('/')}>Home</div>
        <div className="lost_nav_no_color" onClick={() => handleNavigation('/lost')}>Lost</div>
        <div className="found_nav" onClick={() => handleNavigation('/found')}>Found</div>
        <div className="listing_nav" onClick={() => handleNavigation('/listing')}>My Listing</div>
        <div className="response_nav" onClick={() => handleNavigation('/response')}>My Responses</div>
        <div className="chat_nav_open" onClick={() => handleNavigation('/chat')}>My Chats</div>
      </div>

      <div className="main_container_chat">
        <div className="main_left_side_container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Chats"
            className="search_bar"
          />
          {loadingChats ? (
            <Loading loading={loadingChats} />
          ) : (
            <div className="chat_list">
              {chatList
                .filter(chat => chat.receiverName.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((chat, index) => (
                  <div key={index} className="chat_item" onClick={() => handleChatSelect(chat)}>
                    <div className="chat_item_name">{chat.receiverName}</div>
                    <div className="chat_item_message">
                      Last Updated: {new Date(chat.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        <div className="main_right_side_container">
          {selectedChat ? (
            <div className="chat_detail">
              <div className="chat_detail_header">{selectedChat.receiverName}</div>
              <div className="messages_container">
                {messages.map((msg, index) => (
                  <div key={index} className={`chat_message ${msg.senderId === computedSenderId ? "sent" : "received"}`}>
                    <span className="message_text">{msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="chat_input_container">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  className="chat_input_box"
                />
                <button onClick={handleSendMessage} className="send_button">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "200px" }}>
            <img
              src={beginChat}
              alt="No responses found"
              style={{ width: "300px", height: "auto" }}
            />
            <h3>Start Chat</h3>
          </div>
            
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
