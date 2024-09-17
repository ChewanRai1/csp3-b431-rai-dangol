import React, { useContext } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";

function AppNavbar() {
  const { user, unsetUser } = useContext(UserContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        Cap2-Ecommerce
      </Navbar.Brand>
      <Nav className="ml-auto">
        {/* If the user is an admin, show the Admin Dashboard */}
        {user.isAdmin ? (
          <>
            <Nav.Link as={Link} to="/admin-dashboard">
              Admin Dashboard
            </Nav.Link>
            <Button variant="outline-light" onClick={unsetUser}>
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>
            {/* Check if user is logged in */}
            {!user.id ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Log In
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/cart">
                  Cart
                </Nav.Link>
                <Nav.Link as={Link} to="/orders">
                  Orders
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Button variant="outline-light" onClick={unsetUser}>
                  Log Out
                </Button>
              </>
            )}
          </>
        )}
      </Nav>
    </Navbar>
  );
}

export default AppNavbar;
