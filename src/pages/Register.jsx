import React, { useState, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf"; // imports Notyf for notifications
import "notyf/notyf.min.css"; // imports Notyf styles
import UserContext from "../context/UserContext";

function Register() {
  const notyf = new Notyf(); // Initialize Notyf for notifications

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
  });

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      notyf.error("Passwords do not match."); // Show error notification
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/b1/users/register`, // Adjust the URL to match your server's URL
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure it's JSON data
          },
        }
      );

      if (response && response.data && response.data.user) {
        // Set user in context
        setUser({
          id: response.data.user._id,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          mobileNo: response.data.user.mobileNo,
          isAdmin: response.data.user.isAdmin,
        });

        // Show success notification
        notyf.success("Registered successfully!");

        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        notyf.error("Registration failed: Invalid response from server.");
      }
    } catch (err) {
      // Ensure error handling doesn't throw undefined
      notyf.error(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formMobileNo">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            name="mobileNo"
            placeholder="Enter your mobile number"
            value={formData.mobileNo}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </Container>
  );
}

export default Register;
