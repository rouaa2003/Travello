import React, { useState, useEffect } from 'react';
import './NavigationBar.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import AirplaneLogo from '../../Assets/Icons/airplane.svg';
import { useAuth } from '../../AuthContext';

function NavigationBar() {
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("فشل تسجيل الخروج:", error);
    }
  };

  return (
    <Navbar expand='lg' className='position-absolute w-100 z-2'>
      <Container className='nav-con'>
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
  to="/places"
  className={`text-light ${activeLink === '/placespage' ? 'active-link' : ''}`}
>
  Popular Places
</Nav.Link>
<Nav.Link
              as={Link}
              to="/restaurants"
              className={`text-light ${activeLink === '/restaurant' ? 'active-link' : ''}`}
            >
              Restaurants
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/hospital"
              className={`text-light ${activeLink === '/hospital' ? 'active-link' : ''}`}
            >
              Hospital
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/trips"
              className={`text-light ${activeLink === '/trips' ? 'active-link' : ''}`}
            >
              Available Trips
            </Nav.Link>
            <Nav.Link 
            as={Link}
            to={"/explore-cities"}
            className={`text-light ${activeLink === '/explore-cities' ? 'active-link' : ''}`}
             >Cities
              </Nav.Link>
            {user && (
            <>
            <Nav.Link as={Link} to="/profile" className={`text-light ${activeLink === '/profile' ? 'active-link' : ''}`}>
      Profile
    </Nav.Link>
            <button className='btn btn-outline-light ms-3' onClick={handleLogout}>
              Log out
            </button>
            
            </>
          )}

          
            <Link to="/admin-add" className="admin-add-btn">
  إضافة بيانات
</Link>


            {/* زر تسجيل الدخول يظهر فقط إذا المستخدم غير مسجل */}
            
            {!user && (
              <Nav.Link as={Link} to="/login" className="text-light">
                Log in
              </Nav.Link>
            )}
          </Nav>

          {/* زر تسجيل الخروج يظهر فقط إذا المستخدم مسجل دخول */}
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
