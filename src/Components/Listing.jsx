import React, { useState, useEffect } from "react";
import "../Components/Listing.css";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { fetchUserListings } from "./mylisting";
import Loading from "./loding";
import emptyImage from "../Assets/empty.png";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const Listing = () => {
  const navigate = useNavigate();
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) loadUserListings();
      else {
        setUserItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserListings = async () => {
    setLoading(true);
    const items = await fetchUserListings();
    setUserItems(items);
    setLoading(false);
  };

  return (
    <div>
      <Loading loading={loading} />
      <div className="redlabel"></div>
      <div className="navbar_listing">
        <div className="home_nav" onClick={() => navigate("/")}>Home</div>
        <div className="lost_nav1" onClick={() => navigate("/lost")}>Lost</div>
        <div className="found_nav" onClick={() => navigate("/found")}>Found</div>
        <div className="listing_nav_current" onClick={() => navigate("/listing")}>My Listing</div>
        <div className="response_nav" onClick={() => navigate("/response")}>My Responses</div>
        <div className="chat_nav" onClick={() => navigate("/chat")}>My Chats</div>
      </div>
      {loading ? null : userItems.length > 0 ? (
        <div className="main_container_listing">
          <div className="listing-container">
            {userItems.map((item) => (
              <Card
                key={item.id}
                style={{ width: "18rem", cursor: "pointer" }}
                onClick={() => {
                  localStorage.setItem("selectedItemId", item.id);
                  navigate("/productdetails");
                }}
              >
                <Card.Img variant="top" src={item.imageUrl || "https://via.placeholder.com/150"} alt="Reported Item" />
                <Card.Body>
                  <Card.Title>{item.itemName}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img src={emptyImage} alt="No items found" style={{ width: "300px", height: "auto" }} />
          <h3>No items found</h3>
        </div>
      )}
    </div>
  );
};

export default Listing;
