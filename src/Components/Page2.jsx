import React, { useState } from 'react';
import './Page2.css';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Register from './register';
// import Header from './Header';
import Loading from "./loding";

const Page2 = () => {
  const [handlers, setHandlers] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Loading loading={loading} />

      <Register setHandlers={setHandlers} setLoading={setLoading} />
     
        <div className="redlabel"></div>
        <div className="bg">
          <div className="dava_container"></div>
          <div className="login_container_cover">
            <div className="login-container">
              {/* <p id="login_text">Register</p> */}

              <div id="welcome_text">
                Create Your Account – It Only Takes a Minute!
              </div>
              <br />



            <Form className="form" id='form'>
              {/* Name & Student ID on the Same Line */}
              <Row className="mb-3 form-row">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="email_label">Name</Form.Label>
                    <Form.Control id="name_input" className="email_input" placeholder="Enter Your Name" />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="email_label">Student ID</Form.Label>
                    <Form.Control id="student_id_input" className="email_input" placeholder="Enter Student ID" />
                  </Form.Group>
                </Col>
              </Row>

              {/* Email ID & Branch on the Same Line */}
              <Row className="mb-3 form-row">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="email_label">Email</Form.Label>
                    <Form.Control id="email" className="email_input" placeholder="Enter Email ID" />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="email_label">Branch</Form.Label>
                    <Form.Select id="branch" className="email_input">
                      <option value="">Select Branch</option>
                      <option value="Computer">Computer</option>
                      <option value="IT">IT</option>
                      <option value="AIDS">AIDS</option>
                      <option value="EXTC">EXTC</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Password & Confirm Password on the Same Line */}
              <Row className="mb-3 form-row">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="password_label">Password</Form.Label>
                    <Form.Control id="password" className="password_input" type="password" placeholder="Enter Password" />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="password_label">Confirm Password</Form.Label>
                    <Form.Control id="confirm_password" className="password_input" type="password" placeholder="Confirm Password" />
                  </Form.Group>
                </Col>
              </Row>

              <div>
                <Button id="p2_sendLinkBtn" onClick={handlers?.handleSendVerification}>Send Link</Button>
                <Button id="p2_b1" onClick={handlers?.handleRegister}>Register</Button>
              </div>

              <p id='redirect' style={{ color: 'grey', fontSize: 15, marginTop: 10, display: 'flex', alignItems: 'center' }}>
                Already have an account?
                <Nav.Link href="/" id="l2">
                  Sign in
                </Nav.Link>
              </p>
            </Form>
            </div>
          </div>
        </div>
    </>
  );
};

export default Page2;

