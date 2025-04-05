import React, { useState, useEffect } from 'react';
import '../Components/Response.css';
import { useNavigate } from 'react-router-dom';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { auth, database } from "./firebase";
import emptyImage from "../Assets/empty.png";
import Loading from "./loding";
import { ref, get } from 'firebase/database';
import { createChatListEntry } from "./chat";

const Response = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchUserResponsesFromResponses = async (userId) => {
    try {
      const responsesRef = ref(database, "responses");
      const snapshot = await get(responsesRef);
      let results = [];
      if (snapshot.exists()) {
        const allResponses = snapshot.val();

        Object.keys(allResponses).forEach(itemId => {
          const responders = allResponses[itemId];
          if (responders[userId]) {
            results.push({

              id: itemId + "_" + userId,
              itemId,
              ...responders[userId]
            });
          }
        });
      }
      return results;
    } catch (error) {
      console.error("Error fetching responses from 'responses':", error);
      return [];
    }
  };


  const handleChat = async (item) => {
    const user = auth.currentUser;
    if (!user) return;
    const senderId = user.uid;
    const senderName = user.displayName || user.uid;
 
    const receiverId = item.postedBy;

    const receiverName = item.receiverName || receiverId || "Unknown";
    
    try {

      await createChatListEntry(senderId, receiverId, receiverName);

      await createChatListEntry(receiverId, senderId, senderName);

      navigate('/chat', { state: { senderId, senderName, receiverId, receiverName } });
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const data = await fetchUserResponsesFromResponses(user.uid);
        setResponses(data);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLostClick = () => { navigate('/lost'); };
  const handleFoundClick = () => { navigate('/found'); };
  const handleListingClick = () => { navigate('/listing'); };
  const handleMyChatClick = () => { navigate('/chat'); };
  const handleMyResponseClick = () => { navigate('/response'); };
  const handleMyHomeClick = () => { navigate('/'); };

  return (
    <div>
      <div className="redlabel"></div>
      <div className="navbar_lost">
        <div className="home_nav" onClick={handleMyHomeClick}>Home</div>
        <div className="lost_nav1" onClick={handleLostClick}>Lost</div>
        <div className="found_nav" onClick={handleFoundClick}>Found</div>
        <div className="listing_nav" onClick={handleListingClick}>My Listing</div>
        <div className="response_nav_open" onClick={handleMyResponseClick}>My Responses</div>
        <div className="chat_nav" onClick={handleMyChatClick}>My Chats</div>
      </div>

      <div className="main_container_lost">
        {loading ? (
          <Loading loading={loading} />
        ) : responses.length > 0 ? (
          <div className="response-container">
            {responses.map((item) => (
              <Card key={item.id} className="response-card">
                <Card.Body>
                  <Card.Text>
                    <strong>Item Name:</strong> {item.itemName}
                  </Card.Text>
                  <Card.Text>
                    <strong>Question:</strong> {item.question}
                  </Card.Text>
                  <Card.Text>
                    <strong>Your Answer:</strong> {item.answer}
                  </Card.Text>
                  <Card.Text>
                    <strong>Time:</strong> {item.timestamp}
                  </Card.Text>
                  <Card.Text>
                    <strong>Response Status:</strong> {item.responseStatus || 'N/A'}
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    id="chat_button" 
                    style={{ visibility: item.responseStatus === "Approved" ? "visible" : "hidden" }}
                    onClick={() => handleChat(item)}
                  >
                    Chat
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <img
              src={emptyImage}
              alt="No responses found"
              style={{ width: "300px", height: "auto" }}
            />
            <h3>No responses found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Response;
