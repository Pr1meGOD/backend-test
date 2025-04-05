import React, { useState, useEffect, useRef } from "react";
import { fetchLostItems } from "./lost.js";
import { getItemQuestion } from "./getItemQuestion.js";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Components/Lost.css";
import emptyImage from "../Assets/empty.png";
import Loading from "./loding";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { reportItemResponse } from "./report_item_response";
import { toast } from "react-toastify";

const Lost = ({ setLoading }) => {
  const [lostItems, setLostItems] = useState([]);

  const [loadingItems, setLocalLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimQuestion, setClaimQuestion] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    question: "",
    itemType: "",
  });
  const [answer, setAnswer] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [crop, setCrop] = useState({
    unit: "px",
    x: 0,
    y: 0,
    width: 450,
    height: 450,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();


  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      setLoading?.(true);
      setLocalLoading(true);
      const items = await fetchLostItems();
      setLostItems(items);
      setLoading?.(false);
      setLocalLoading(false);
    };
    loadItems();
  }, [setLoading]);

  const handleClaimClick = async (userId, itemId) => {
    const result = await getItemQuestion(userId, itemId);
    if (result.success) {
      setClaimQuestion(result.question);
      setSelectedItem({ userId, itemId });
      setShowClaimModal(true);
    } else {
      console.error("Error fetching question:", result.error);
    }
  };

  const handleClaimClose = () => {
    setShowClaimModal(false);
    setClaimQuestion("");
    setSelectedItem(null);
    setImage(null);
    setImagePreview(null);
    setCrop({
      unit: "px",
      x: 0,
      y: 0,
      width: 450,
      height: 450,
      aspect: 1,
    });
    setCompletedCrop(null);
    setAnswer("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (c) => {
    setCompletedCrop(c);
  };

  const getCroppedImg = async () => {
    if (!imgRef.current || !completedCrop) return null;
    const canvas = canvasRef.current;
    const imageElement = imgRef.current;
    const ctx = canvas.getContext("2d");
    const scaleX = imageElement.naturalWidth / imageElement.width;
    const scaleY = imageElement.naturalHeight / imageElement.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    ctx.drawImage(
      imageElement,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const croppedBlob = await getCroppedImg();
    if (!croppedBlob) {
      alert("Failed to process the image. Please try again.");
      setIsSubmitting(false);
      return;
    }
    if (!answer.trim()) {
      alert("Please provide an answer.");
      setIsSubmitting(false);
      return;
    }
    try {
      const result = await reportItemResponse(
        selectedItem.itemId,
        answer,
        croppedBlob
      );
      if (result.success) {
        toast.success("Response submitted successfully!");
        handleClaimClose();
      } else {
        toast.error("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("Failed to submit response.");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Loading loading={loadingItems} />
      <div className="redlabel"></div>
      <div className="navbar_lost">
        <div className="home_nav" onClick={() => { setShowClaimModal(false); navigate("/"); }}>Home</div>
        <div className="lost_nav" onClick={() => navigate("/lost")}>Lost</div>
        <div className="found_nav" onClick={() => navigate("/found")}>Found</div>
        <div className="listing_nav" onClick={() => navigate("/listing")}>My Listing</div>
        <div className="response_nav" onClick={() => navigate("/response")}>My Responses</div>
        <div className="chat_nav" onClick={() => navigate("/chat")}>My Chats</div>
      </div>
      {loadingItems ? null : lostItems.length > 0 ? (
        <div className="main_container_lost">
          <div className="lost-container">
            {lostItems.map((item) => (
              <Card key={item.id} style={{ width: "18rem" }}>
                <Card.Img
                  variant="top"
                  src={item.imageUrl || "https://via.placeholder.com/150"}
                  alt="Lost Item"
                  style={{ height: "300px" }}
                />
                <Card.Body>
                  <Card.Title>{item.itemName}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Button
                    variant="secondary"
                    className="custom-button mt-3"
                    onClick={() => handleClaimClick(item.userId, item.id)}
                  >
                    Found Item
                  </Button>
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
      <Modal show={showClaimModal} onHide={handleClaimClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Answer the question to claim item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isSubmitting ? (
            <Loading loading={isSubmitting} />
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{claimQuestion}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Answer the question..."
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} required />
              </Form.Group>
              {imagePreview && (
                <div>
                  <p>Crop Image:</p>
                  <ReactCrop
                    crop={crop}
                    onChange={(newCrop) => setCrop(newCrop)}
                    onComplete={handleCropComplete}
                    aspect={1}
                    keepSelection
                    locked={false}
                    resizeMode="corner"
                    minWidth={100}
                    minHeight={100}
                    ruleOfThirds
                  >
                    <img ref={imgRef} src={imagePreview} alt="Preview" style={{ maxWidth: "100%" }} />
                  </ReactCrop>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <Button variant="primary" type="submit" className="mt-3">Submit</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Lost;
