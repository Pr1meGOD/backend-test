// import React from 'react';
// import Container from 'react-bootstrap/Container';
// import Navbar from 'react-bootstrap/Navbar';
// import logo from '../Assets/logo.png';
// import logo2 from '../Assets/logo2.png';
// import Hamburger from 'hamburger-react'
// import './Header.css';

// const Header = () => {
//   return (
//     <>
//       <Navbar className="bg-body-tertiary">
//         <Container className="Head">
//           <Navbar.Brand href="#home">
//             <img
//               src={logo}
//               className="logo"
//               alt="Logo"
//             />
//             <img
//               src={logo2}
//               className="logo2"
//               alt="Logo 2"
//             />
//             {/* <Hamburger toggled={isOpen} toggle={setOpen} className="humburger"/> */}
//           </Navbar.Brand>
//         </Container>
//       </Navbar>
//     </>
//   );
// };

// export default Header;

// import React, { useState } from 'react';
// import Container from 'react-bootstrap/Container';
// import Navbar from 'react-bootstrap/Navbar';
// import logo from '../Assets/logo.png';
// import logo2 from '../Assets/logo2.png';
// import Hamburger from 'hamburger-react';
// import './Header.css';
// import { auth } from './firebase';
// import { useNavigate } from 'react-router-dom';

// const Header = () => {
//   const [isOpen, setOpen] = useState(false);
//   const navigate = useNavigate();

//   // const handleLogout = async () => {
//   //   try {
//   //     await auth.signOut();
//   //     navigate('/', { replace: true });
//   //   } catch (error) {
//   //     console.error("Logout failed: ", error);
//   //   }
//   // };

//   return (
//     <Navbar className="bg-body-tertiary">
//       <Container fluid className="Head">
//         {/* Left Logo */}
//         <div className="nav_left">
//           <img src={logo} className="logo" alt="Logo" />
//         </div>

//         {/* Right Logo */}
//         <div className="nav_right">
//           {/* <span className="logout-link" id = "Logout" onClick={handleLogout}>Logout</span> */}
//           <img src={logo2} className="logo2" alt="Logo 2" />
//         </div>

//         {/* Hamburger for Mobile */}
//         <div className="hamburger">
//           <Hamburger toggled={isOpen} toggle={setOpen} />
//         </div>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;


// 18-03-25

import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../Assets/logo.png';
import logo2 from '../Assets/logo2.png';
import Hamburger from 'hamburger-react';
import './Header.css';
import { auth } from './firebase';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest(".hamburger") && !event.target.closest("#main_container")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <Navbar className="bg-body-tertiary">
      <Container fluid className="Head">
        {/* Left Logo */}
        <div className="nav_left">
          <img src={logo} className="logo" alt="Logo" />
        </div>

        {/* Right Logo */}
        <div className="nav_right">
          <img src={logo2} className="logo2" alt="Logo 2" />
        </div>

        {/* Hamburger for Mobile - Only Visible on Page3 */}
        {location.pathname === "/page3" && (
          <div className="hamburger">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;


