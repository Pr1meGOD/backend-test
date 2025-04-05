import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Page3.css';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import LogoutButton from './LogoutButton';
import userprofile from '../Assets/user_profile1.jpg';
import LostItems from '../Assets/lost_items.png';
import FoundItems from '../Assets/found_items.png';
import Listing from '../Assets/list.png';
import Response from '../Assets/notification.png';
import Chat from "../Assets/chat.png";
import useUserData from "./home.js";
import { reportItem } from './report_item.js';
import { toast } from 'react-toastify';
import Loading from "./loding";

function Page3() {
  const navigate = useNavigate();
  const { userData, loading } = useUserData();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    question: '',
    itemType: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [crop, setCrop] = useState({ unit: 'px', x: 0, y: 0, width: 450, height: 450, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    const handleBack = () => {
      window.history.go(1);
    };
    window.addEventListener("popstate", handleBack);
    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const handleLostClick = () => {
    navigate('/lost');
  };

  const handleFoundClick = () => {
    navigate('/found');
  };
  const handleListingClick = () => {
    navigate('/listing');
  };
  const handleMyChatClick = () => {
    navigate('/chat');
  };

  const handleMyResponseClick = () => {
    navigate('/response');
  };

  const handleReportClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({ itemName: '', description: '', question: '', itemType: '' });
    setImage(null);
    setImagePreview(null);
    setCroppedImage(null);
    setCrop({ unit: 'px', x: 0, y: 0, width: 450, height: 450, aspect: 1 });
    setCompletedCrop(null);
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
    const image = imgRef.current;
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
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
    if (croppedBlob) {
      const result = await reportItem(formData, croppedBlob);
      if (result.success) {
        toast.success("Report submitted successfully!");
      } else {
        toast.error("Error: " + result.error);
      }
    }
    setIsSubmitting(false);
    handleClose();
  };

  return (
    <>
      <div className="redlabel"></div>
      <div className="main_container">
        <div className="left_vertical_container">
          <div className="upper_container">
            <div className="photo_container">
              <img src={userprofile} alt="" />
            </div>
            <div className="user_name">{loading ? "Loading..." : userData?.name || "N/A"}</div>
            <div className="user_email_id">{loading ? "Loading..." : userData?.email || "N/A"}</div>
            <div className="deptname">{loading ? "Loading..." : userData?.branch || "N/A"}</div>
            <div className="user_student_id">Student ID: {loading ? "Loading..." : userData?.studentId || "N/A"}</div>
            <div className="logout_button"><LogoutButton /></div>
          </div>
          <div className="menu">
            <div className="menu-item" id='lost_menu_item' onClick={handleLostClick}>
              <img src={LostItems} alt="Lost" />
              <span id='lost_text'>Lost</span>
            </div>
            <div className="menu-item" id='found_menu_item' onClick={handleFoundClick}>
              <img src={FoundItems} alt="Found" />
              <span id='found_text'>Found</span>
            </div>
            <div className="menu-item" id='list_menu_item' onClick={handleListingClick}>
              <img src={Listing} alt="My Listing" />
              <span id='list_text'>Listing</span>
            </div>
            <div className="menu-item" id='response_menu_item' onClick={handleMyResponseClick}>
              <img src={Response} alt="Response" />
              <span id='response_text'>Response</span>
            </div>
            <div className="menu-item" id='chat_menu_item' onClick={handleMyChatClick}>
              <img src={Chat} alt="Chat" />
              <span id='chat_text'> My Chat</span>
            </div>
          </div>
        </div>
        <div className="right_vertical_container">
          <Button
            variant="secondary"
            className="custom-button"
            id="report_button"
            onClick={() => setShowModal(true)}
          >
            Report Item
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Report Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isSubmitting ? (
            <Loading loading={isSubmitting} />
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Item Name</Form.Label>
                <Form.Control type="text" name="itemName" value={formData.itemName} onChange={handleChange} placeholder="Enter item name" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} placeholder="Enter a description" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Enter a Question (for verification)</Form.Label>
                <Form.Control type="text" name="question" value={formData.question} onChange={handleChange} placeholder="Ask a question" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Item Type</Form.Label>
                <Form.Select name="itemType" value={formData.itemType} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload an Image</Form.Label>
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
                    minWidth={100}
                    minHeight={100}
                    ruleOfThirds
                    locked={false}
                  >
                    <img ref={imgRef} src={imagePreview} alt="Preview" style={{ maxWidth: '100%' }} />
                  </ReactCrop>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
              {croppedImage && (
                <div>
                  <img src={croppedImage} alt="Cropped Preview" style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              )}
              <Button variant="primary" type="submit" className="mt-3">Submit</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Page3;
