import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export const WelcomeEmail = ({ userFirstname = 'User' }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>
        Welcome to the K.J. Somaiya Lost & Found Portal!
      </Preview>
      <Container style={container}>
        <Img
          src="https://i.imgur.com/p09fAA0.png" 
          width="170"
          height="50"
          alt="K.J. Somaiya Lost & Found Portal"
          style={logoStyle}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Welcome to the <strong>K.J. Somaiya Lost & Found</strong>—your go-to platform for reporting and finding lost items on campus. Whether you’ve misplaced something or found an unclaimed item, our website makes it easy to connect with the right people and reunite belongings with their owners.
        </Text>
        <Text style={paragraph}>
          Start by posting a lost or found item now and help keep our community connected!
        </Text>
        
        <Section style={btnContainer}>
  <Button 
    style={{ 
      backgroundColor: '#E74C3C',
      borderRadius: '5px',
      color: '#ffffff',
      fontSize: '16px',
      textDecoration: 'none',
      padding: '12px 24px',
      display: 'inline-block',
      margin: '0 auto'
    }} 
    href="https://kjsitlaf.vercel.app"
  >
    Visit the website
  </Button>
</Section>
       
        <Text style={paragraph}>
          Happy searching,
          <br />
          <strong>The K.J. Somaiya Lost & Found Team</strong>
        </Text>
        <Hr style={hr} />
      </Container>
    </Body>
  </Html>
);
  
  WelcomeEmail.PreviewProps = {
    userFirstname: 'User',
  };
  
  export default WelcomeEmail;
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };
  
  const logoStyle = {
    margin: '0 auto',
    display: 'block',
  };
  
  const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#333333',
    margin: '20px 0',
  };
  
  const btnContainer = {
    textAlign: 'center',
    margin: '20px 0',
  };
  
  const button = {
    backgroundColor: '#E74C3C', // Red color
    borderRadius: '5px',
    color: '#ffffff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '12px 24px',
    margin: '0 auto',
  };
  
  const hr = {
    borderColor: '#E74C3C', // Red color
    margin: '20px 0',
  };
  
  const footer = {
    color: '#888888',
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '20px',
  };

  export const config = {
    reactStrictMode: false,
  };