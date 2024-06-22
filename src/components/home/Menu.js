import React, {useState, useEffect} from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import LoginModal from '../account/LoginModal';

const Menu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Nav className="ml-auto">
              {isLoggedIn ? (
                <Nav.Link href="#" onClick={handleLogout}>Logout</Nav.Link>
              ) : (
                <Button onClick={handleLoginClick}>Login</Button>
              )}
            </Nav>

        </Container>
      </Navbar>
      <LoginModal show={showLoginModal} handleClose={handleCloseLoginModal} setIsLoggedIn={setIsLoggedIn} />
    </>
  );
};
export default Menu;