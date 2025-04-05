import { ref, push, set, update } from "firebase/database";
import { database } from "./firebase";


export const createChatListEntry = async (userId, peerId, peerName) => {
  try {
    const senderChatRef = ref(database, `ChatList/${userId}/${peerId}`);
    const receiverChatRef = ref(database, `ChatList/${peerId}/${userId}`);
    

    const chatEntrySender = { peerName, lastUpdated: Date.now() };
    const chatEntryReceiver = { peerName: "You", lastUpdated: Date.now() };

    await update(senderChatRef, chatEntrySender);
    await update(receiverChatRef, chatEntryReceiver);
  } catch (error) {
    console.error("Error creating chat list entry:", error);
    throw error;
  }
};


export const sendChatMessage = async (senderId, senderName, receiverId, receiverName, message) => {
  try {
    const trimmedMessage = message.trim();
    if (trimmedMessage === "") throw new Error("Message cannot be empty.");
    
    const chatsRef = ref(database, "Chats");
    const newMessageRef = push(chatsRef);
    const messageData = {
      isseen: false,
      message: trimmedMessage,
      messageId: newMessageRef.key,
      receiverId,
      senderId,
      timestamp: Date.now(),
    };

    await set(newMessageRef, messageData);


    await createChatListEntry(senderId, receiverId, receiverName);
    await createChatListEntry(receiverId, senderId, senderName);

    return messageData;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};
