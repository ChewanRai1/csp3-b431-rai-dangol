import { useState, useEffect } from "react";
import "./App.css";
import Container from "react-bootstrap/Container";
import AppNavbar from "./components/AppNavbar"; // You need to create this component
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductCatalog from "./pages/ProductCatalog";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
// import UserOrders from "./pages/UserOrders";
import ProductDetails from "./pages/ProductDetails"; // Import the component
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import OrderList from "./pages/OrderList";
import ChangePassword from "./pages/ChangePassword";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // You need to create this context

function App() {
  const [user, setUser] = useState({
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    mobileNo: null,
    isAdmin: null,
  });

  // Function to log out user and clear localStorage
  function unsetUser() {
    localStorage.clear();
    setUser({
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      mobileNo: null,
      isAdmin: null,
    });
  }

  // Function to retrieve user details from server
  function retrieveUserDetails(token) {
    fetch(`${import.meta.env.VITE_API_URL}/b1/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setUser({
            id: data.user._id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            mobileNo: data.user.mobileNo,
            isAdmin: data.user.isAdmin,
          });
        } else {
          unsetUser();
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        unsetUser();
      });
  }

  // UseEffect to fetch user details when the app mounts or user changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      retrieveUserDetails(token);
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container className="mt-4">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            {/* <Route path="/user-orders" element={<UserOrders />} /> */}
            <Route
              path="/product-details/:productId"
              element={<ProductDetails />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<div>Page Not Found</div>} />{" "}
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
