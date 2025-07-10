import React, { useState } from 'react';
import './NavigationBar.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Link, useLocation } from 'react-router-dom';
import AirplaneLogo from '../../Assets/Icons/airplane.svg';

function NavigationBar() {
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();

  // تحديد العنصر النشط بناءً على المسار الحالي
  React.useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <Navbar expand='lg' className='position-absolute w-100 z-2'>
      <Container>
        <Navbar.Brand className='text-light'>
          <Link to='/' className='text-decoration-none text-light d-flex'>
            <img className='me-2' src={AirplaneLogo} alt="logo" />
            TRAVELLO
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' className='text-light' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto w-100 justify-content-center'>
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`text-light ${activeLink === '/' ? 'active-link' : ''}`}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/holidays" 
              className={`text-light ${activeLink === '/holidays' ? 'active-link' : ''}`}
            >
             Landmarks
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/city-breaks" 
              className={`text-light ${activeLink === '/city-breaks' ? 'active-link' : ''}`}
            >
              City breaks
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/restaurant" 
              className={`text-light ${activeLink === '/restaurant' ? 'active-link' : ''}`}
            >
             Restaurant
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/hospital" 
              className={`text-light ${activeLink === '/hospital' ? 'active-link' : ''}`}
            >
             Hospital
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar;