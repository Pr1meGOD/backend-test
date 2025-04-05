import React, { useState, useEffect } from "react";
import { auth, database } from "./firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register({ setHandlers, setLoading }) {
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();

  const [Users, setUsers] = useState({
    name: "",
    branch: "",
    email: "",
    studentId: "",
  });



  useEffect(() => {
    if (setHandlers) {
      setHandlers({
        handleSendVerification,
        handleRegister,
      });
    }
  }, [setHandlers]);

  const handleSendVerification = async (e) => {
    e.preventDefault();

    

    const name = document.getElementById("name_input")?.value;
    const branch = document.getElementById("branch")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirm_password")?.value;
    const studentId = document.getElementById("student_id_input")?.value;

    if (!email || !password || !confirmPassword || !studentId || !name || !branch)
    {
      toast.error("All fields are required!");
      return;

    }

    if (!/^\d{10}$/.test(studentId)) 
    {
      toast.error("Enter a valid Student ID!");
      return;
    }
    else{
      try {
        // Check if studentId already exists
        const studentIdRef = ref(database, "studentId/" + studentId);
        console.log("Checking student ID at path:", studentIdRef);
        const snapshot = await get(studentIdRef);
        console.log("Snapshot exists:", snapshot.exists());

        if (snapshot.exists()) 
        {
          toast.error("Student ID already exists.");
          return;

        }
      } 
      catch (error) 
      {
        console.error("Firebase get() error:", error.code, error.message);
        toast.error("Error checking Student ID. Try again.");
        return;

      }
    }

    if (password !== confirmPassword) 
    {
      toast.error("Passwords do not match!");
      return;

    }

    try 
    {

      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      
      toast.success("Verification email sent! Please check your email.");
      setEmailSent(true);
    } 
    catch (error) 
    {
      toast.error(error.message);

    }
    finally
    {
      setLoading(false);
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
  
    if (!user) {
      toast.error("No user found! Please send verification email first.");
      return;
    }
  
    await user.reload();
    if (!user.emailVerified) {
      toast.error("Please verify your email before registering.");
      return;
    }
  
    const studentId = document.getElementById("student_id_input")?.value;
    const userData = {
      name: document.getElementById("name_input")?.value,
      branch: document.getElementById("branch")?.value,
      email: document.getElementById("email")?.value,
      studentId: studentId
    };
  
    try {
      await set(ref(database, "studentId/" + studentId), { uid: user.uid });
      await set(ref(database, "users/" + user.uid), userData);
  
      const emailResponse = await fetch('https://a05ec87f-aaf0-4c2d-a2e6-359f0ffc2d3f-00-31iqtlotd7nxp.sisko.replit.dev/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name
        }),
      });
  
      if (!emailResponse.ok) {
        throw new Error('Failed to send welcome email');
      }
  
      console.log("User data saved and welcome email sent!");
      toast.success("Registration successful!");
      navigate("/page3", { replace: true });
  
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message);
    }
  };
  return null;
}

export default Register;
