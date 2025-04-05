import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("pass")?.value;
    

    if (!email || !password) 
    {
      toast.error("All fields are required!");
      return;
      
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await user.reload();

      if (!user.emailVerified) 
      {
        toast.error("Please verify your email before logging in.");
        return;

      }

      toast.success("Login successful!");
      navigate("/page3", { replace: true });
    } 
    catch (error) 
    {
      if (error.code === "auth/user-not-found") 
      {
        toast.error("User not found! Please register.");

      } else if (error.code === "auth/wrong-password") 
      {
        toast.error("Incorrect password! Please try again.");

      } else 
      {
        toast.error(error.message);

      }
    }
  };


  const handleForgotPassword = async () => {
    const email = document.getElementById("email")?.value;

    if (!email) {
      toast.error("Please enter your email to reset password!");
      return;
    }

    try 
    {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");

    } 
    catch (error) 
    {
      if (error.code === "auth/user-not-found") 
      {
        toast.error("User not found! Please register.");
      } 
      else 
      {
        toast.error(error.message);
      }
    }
  };

  return { handleLogin, handleForgotPassword };
}

export default Login;
