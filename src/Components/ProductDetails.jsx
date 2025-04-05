import React, { useState, useEffect } from 'react';
import '../ProductDetails.css';
import dummy_image from '../Assets/login_page_bg.jpg';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Loading from "./loding";
import emptyImage from "../Assets/empty.png";

// Firebase Auth
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Import helpers from item_details.js
import { fetchProductDetails, fetchProductResponses } from './item_details';

// NEW: Import functions from changeResponseStatus.js
import { approveResponse, rejectResponse } from './changeResponseStatus';

const ProductDetails = () => {
  const [loading, setLoading] = useState(true);
  const [itemDetails, setItemDetails] = useState(null);
  const [productResponses, setProductResponses] = useState([]);

  // Optional modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleShow = (option) => {
    setSelectedOption(option);
    setShowModal(true);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowModal(false);
  };

  // Updated button handlers using our new functions
  const handleAccept = async (responseId) => {
    const confirmResult = window.confirm("Are you sure you want to accept the response?");
    if (!confirmResult) return;
    const result = await approveResponse(itemDetails.id, responseId);
    if (result.success) {
      const responses = await fetchProductResponses(itemDetails.id);
      setProductResponses(responses);
    } else {
      console.error("Error accepting response:", result.error);
    }
  };

  const handleReject = async (responseId) => {
    const confirmResult = window.confirm("Are you sure you want to reject the response?");
    if (!confirmResult) return;
    const result = await rejectResponse(itemDetails.id, responseId);
    if (result.success) {
      const responses = await fetchProductResponses(itemDetails.id);
      setProductResponses(responses);
    } else {
      console.error("Error rejecting response:", result.error);
    }
  };

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        console.log("No user is logged in.");
        setLoading(false);
        return;
      }

      // 1) Get the push key (item ID) from localStorage
      const storedItemId = localStorage.getItem("selectedItemId");
      console.log("Selected Item ID from localStorage:", storedItemId);

      if (!storedItemId) {
        console.log("No selectedItemId found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        // 2) Fetch product details from "myreports"
        const details = await fetchProductDetails(storedItemId);
        console.log("Fetched product details:", details);
        setItemDetails(details);

        // 3) Fetch product responses from "responses/[itemId]"
        const responses = await fetchProductResponses(storedItemId);
        console.log("Fetched product responses:", responses);
        setProductResponses(responses);
      } catch (err) {
        console.error("Error fetching item details or responses:", err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Loading loading={loading} />

      {!loading && (
        <div className="main_entire_page">
          <div className="redlabel"></div>

          <div className="remaining_part_container">
            {/* Left side: item image */}
            <div className="left_remaining_container">
              <div className="photo_container_my_list">
                <img
                  src={itemDetails?.imageUrl || dummy_image}
                  alt="dummy_image"
                  id="my_listing_image"
                  style={{ width: "18rem", height: "auto" }}
                />
              </div>
            </div>

            {/* Right side: item details */}
            <div className="right_remaining_container">
              <div className="my_list_data_container">
                <div className="item_name">
                  <strong>Item Name:</strong> {itemDetails?.itemName || ""}
                </div>
                <div className="item_description">
                  <strong>Description:</strong> {itemDetails?.description || ""}
                </div>
                <div className="type">
                  <strong>Type:</strong> {itemDetails?.itemType || ""}
                </div>
                <div className="created_at">
                  <strong>Created at:</strong> {itemDetails?.timestamp || ""}
                </div>

                <Button variant="danger" id="delete_post_btn">
                  Delete
                </Button>
                <Button variant="success" id="edit_post_btn">
                  Edit Item
                </Button>
              </div>
            </div>
          </div>

          {/* Responses section */}
          <div style={{ marginTop: "20px" }}>
            <h3>Responses</h3>
          </div>

          <div
            className="response_cards_container"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              marginTop: "20px",
            }}
          >
            {productResponses && productResponses.length > 0 ? (
              productResponses.map((response) => (
                <Card
                  key={response.id}
                  style={{ width: "18rem", margin: "10px" }}
                >
                  {/* If the response includes an imageUrl, show it */}
                  {response.imageUrl && (
                    <Card.Img
                      variant="top"
                      src={response.imageUrl}
                      alt="Response"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <Card.Body>
                    <Card.Text>
                      <strong>Question:</strong> {response.question}
                    </Card.Text>
                    <Card.Text>
                      <strong>Answer:</strong> {response.answer}
                    </Card.Text>
                    <Card.Text>
                      <strong>Time:</strong> {response.timestamp}
                    </Card.Text>
                    <Card.Text>
                      <strong>Status:</strong> {response.responseStatus || 'N/A'}
                    </Card.Text>
                    {/* Accept and Reject buttons */}
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="success"
                        onClick={() => handleAccept(response.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleReject(response.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
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

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Your Choice</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You selected "{selectedOption}". Once submitted, this cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
