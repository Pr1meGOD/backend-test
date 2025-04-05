// import './App.css';
// import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Header from './Components/Header';
// // import Header2 from './Components/Header2';
// import Page1 from './Components/Page1';
// import Page2 from './Components/Page2';
// import Page3 from './Components/Page3';
// import Lost from './Components/Lost';
// import Found from './Components/Found';
// import Register from './Components/register';
// import ProfilePage from './Components/ProfilePage';
// import { useEffect, useState } from 'react';
// import { auth } from './Components/firebase';

// function App() {
//   const location = useLocation(); // Get the current route
//   const [user, setUsers] = useState();

//   useEffect(() => {
//     auth.onAuthStateChanged((user) => {
//       setUsers(user);
//     });
//   });

//   // List of pages where Header (Navbar 1) should be shown
//   const headerPages = ['/page3', '/profile'];

//   return (
//     <>
//       <ToastContainer position="top-center" autoClose={2000} />

//       {/* Conditionally render Header or Header2 based on the route */}
//       {headerPages.includes(location.pathname) ? <Header2 /> : <Header />}

//       <Routes>
//         <Route path="/" element={user? <Navigate to="/page3"/> : <Page1 />} />
//         <Route path="/page2" element={<Page2 />} />
//         <Route path="/page3" element={<Page3 />} />
//         <Route path="/found" element={<Found />} />
//         <Route path="/lost" element={<Lost />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/profile" element={<ProfilePage />} />
//       </Routes>
//     </>
//   );
// }

// // Wrap App in BrowserRouter to allow useLocation inside App
// function AppWrapper() {
//   return (
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   );
// }

// export default AppWrapper;

// Latest app.js 14-03-2025

import './App.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Components/Header.jsx';
import Page1 from './Components/Page1.jsx';
import Page2 from './Components/Page2.jsx';
import Page3 from './Components/Page3.jsx';
import Lost from './Components/Lost.jsx';
import Found from './Components/Found.jsx';
import Register from './Components/register';
import ProfilePage from './Components/ProfilePage';
import Listing from './Components/Listing.jsx';
import Response from './Components/Response.jsx';
import Chat from './Components/Chat.jsx';
import { useEffect, useState } from 'react';
import { auth } from './Components/firebase';
import ProductDetails from './Components/ProductDetails.jsx';

function App() {
  const location = useLocation(); // Get the current route
  const [user, setUsers] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUsers(user);
    });
  });

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Uniform Header across all pages */}
      <Header />

      <Routes>
        <Route path="/" element={user ? <Navigate to="/page3" /> : <Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/found" element={<Found />} />
        <Route path="/lost" element={<Lost />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/listing" element={<Listing/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/response' element={<Response/>}/>
        <Route path='/productdetails' element={<ProductDetails/>}/>
      </Routes>
    </>
  );
}

// Wrap App in BrowserRouter to allow useLocation inside App
function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;