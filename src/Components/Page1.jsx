import React, {useEffect} from 'react';
import { useState } from 'react';
import './New_page.css';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import Login from './login';
import bgImage from '../Assets/login_bg.jpg';
// import Loading from "./loding";
// import Register from './register';

const Page1 = () => {
  const navigate = useNavigate();

  useEffect(() => {
      // Push a dummy state to prevent back navigation
      window.history.pushState(null, null, window.location.href);
      //  const [handlers, setHandlers] = useState(null);
      
      const handleBack = () => {
        window.history.go(1); // Prevents going back
      };
  
      window.addEventListener("popstate", handleBack);
      return () => {
        window.removeEventListener("popstate", handleBack);
      };
    }, []);

  const { handleLogin, handleForgotPassword } = Login(); 
  // const [loading, setLoading] = useState(false);

  return (
    <>
    {/* //change
      <Loading loading={loading} />

      <Register setHandlers={setHandlers} setLoading={setLoading} /> */}
     
      <div className="redlabel"></div>
        <div className="bg">
          <div className="left_bajucha_container">
          </div>
          
          <div className="login_container_cover">
          <div className="login-container">
          {/* <p id='login_text'>Login</p> */}

            <div id="welcome_text">
            Welcome Back! Log in to Continue.
            </div> 
            <br />
            <Form className="form">
              <Form.Group as={Row} className="mb-3">
                <Form.Label className='email_label'>
                  Email
                </Form.Label>
                <Col >
                  <Form.Control id='email' className='email_input'  placeholder="Enter Email ID" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="password_label">
                <Form.Label column>
                  Password
                </Form.Label>
                <Col sm={12}>
                  <Form.Control id='pass' className='password_input'  type="password" placeholder="Enter your password" />
                </Col>
              </Form.Group>

              <p id='forgot_password' onClick={handleForgotPassword} >Forgot Password</p>

              <Button variant="secondary" id='p1_b1'  active onClick={handleLogin}>
                Login
              </Button>

              <p style={{ color: 'grey', fontSize: 15, marginTop: 10, display: 'flex', alignItems: 'center' }}>
                Don't have an account?
                <Nav.Link href="/page2" id='l1'>Sign up</Nav.Link>
              </p>
            </Form>
          </div>
          </div>
        </div>
        
    </>
  );
};

export default Page1;
