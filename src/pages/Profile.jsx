import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  // Initialize all fields with empty strings to avoid undefined values
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    // password: "", // Optional field for changing password
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found, please log in again.");
          return;
        }

        console.log("Fetching profile data..."); // Debugging line
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/b1/users/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.user) {
          console.log("Profile data received:", response.data.user); // Debugging line
          setProfileData({
            firstName: response.data.user.firstName || "",
            lastName: response.data.user.lastName || "",
            email: response.data.user.email || "",
            mobileNo: response.data.user.mobileNo || "",
            // password: "", // Password field is optional and can remain blank
          });
        } else {
          setError("Failed to retrieve user data.");
          console.error("No user data received from API"); // Debugging line
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
        setError("Failed to load profile. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      console.log("Sending profile update request..."); // Debugging line
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/b1/users/update-profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user context with new profile data
      setUser({
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        mobileNo: profileData.mobileNo,
      });

      setLoading(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Profile</h2>
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSave}>
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="lastName" className="mt-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="email" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            disabled
          />
        </Form.Group>

        <Form.Group controlId="mobileNo" className="mt-3">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            name="mobileNo"
            value={profileData.mobileNo}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* <Form.Group controlId="password" className="mt-3">
          <Form.Label>New Password (Leave blank to keep current)</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={profileData.password}
            onChange={handleInputChange}
          />
        </Form.Group> */}

        <Button
          variant="primary"
          type="submit"
          className="mt-4"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Form>
      <div className="mt-3">
        <Link to="/change-password">Change Password</Link>
      </div>
    </Container>
  );
};

export default Profile;
