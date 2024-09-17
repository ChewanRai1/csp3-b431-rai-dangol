import { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import { Navigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { Notyf } from "notyf"; // imports the notyf module
import "notyf/notyf.min.css"; // imports the style for notyf boxes

export default function Login() {
  const notyf = new Notyf(); // Initialize Notyf for notifications

  // State hooks to store the values of the input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State to determine whether submit button is enabled or not
  const [isActive, setIsActive] = useState(false);
  // State to determine if the user is an admin
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);

  // Context for user management
  const { user, setUser } = useContext(UserContext);

  // Function to authenticate the user
  function authenticate(e) {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/b1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          // Save token to local storage
          localStorage.setItem("token", data.access);
          retrieveUserDetails(data.access);

          // Clear input fields after submission
          setEmail("");
          setPassword("");

          // Show success notification
          notyf.success("You are now logged in");
        } else if (data.error === "Email and password do not match") {
          notyf.error("Incorrect email or password");
        } else if (data.error === "No Email Found") {
          notyf.error(`${email} does not exist`);
        }
      })
      .catch((err) => {
        notyf.error("Login failed. Please try again.");
        console.error("Login error:", err);
      });
  }

  // Retrieve user details after login
  function retrieveUserDetails(token) {
    fetch(`${import.meta.env.VITE_API_URL}/b1/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          id: data.user._id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          mobileNo: data.user.mobileNo,
          isAdmin: data.user.isAdmin,
        });

        // If the user is an admin, set redirect to admin
        if (data.user.isAdmin) {
          setRedirectToAdmin(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      });
  }

  // Effect hook to enable/disable the login button based on input fields
  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  // If user is an admin, redirect to the admin dashboard
  if (redirectToAdmin) {
    return <Navigate to="/admin-dashboard" />;
  }

  // If user is logged in (not an admin), redirect to products
  return user.id !== null ? (
    <Navigate to="/products" />
  ) : (
    <Form onSubmit={(e) => authenticate(e)}>
      <h1 className="my-5 text-center">Login</h1>
      <Form.Group>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      {isActive ? (
        <Button variant="primary" type="submit" id="loginBtn">
          Login
        </Button>
      ) : (
        <Button variant="danger" type="submit" id="loginBtn" disabled>
          Login
        </Button>
      )}
    </Form>
  );
}
