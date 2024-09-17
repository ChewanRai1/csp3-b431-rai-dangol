import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Container, Table, Button, Modal } from "react-bootstrap";
import UserContext from "../context/UserContext";
import AddProduct from "./AddProduct"; // Import AddProduct component
import UpdateProduct from "./UpdateProduct"; // Import UpdateProduct component

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); // State to hold all user orders
  const [showAddProduct, setShowAddProduct] = useState(false); // Modal visibility state
  const [showUpdateProduct, setShowUpdateProduct] = useState(false); // Modal visibility for update
  const [showOrdersModal, setShowOrdersModal] = useState(false); // Modal visibility for showing orders
  const [selectedProduct, setSelectedProduct] = useState(null); // State to store the product to be updated
  const { user } = useContext(UserContext); // Get the token and user details

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/b1/products/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Function to toggle product's active status
  const toggleProductStatus = async (productId, isActive) => {
    const token = localStorage.getItem("token");
    const endpoint = isActive
      ? `${import.meta.env.VITE_API_URL}/b1/products/${productId}/archive`
      : `${import.meta.env.VITE_API_URL}/b1/products/${productId}/activate`;

    try {
      const response = await axios.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the products list in the UI
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isActive: !isActive }
            : product
        )
      );
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product); // Set the selected product to be updated
    setShowUpdateProduct(true); // Show the Update modal
  };

  // Function to fetch all user orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/b1/orders/all-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.orders); // Set fetched orders in the state
      setShowOrdersModal(true); // Show the orders modal
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setShowAddProduct(true)}>
          Add New Product
        </Button>
        <Button variant="success" onClick={fetchOrders}>
          Show User Orders
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.isActive ? "Available" : "Unavailable"}</td>
                <td>
                  <Button
                    variant="info"
                    className="mr-2"
                    onClick={() => handleUpdateClick(product)} // Open Update modal with selected product
                  >
                    Update
                  </Button>
                  <Button
                    variant={product.isActive ? "danger" : "success"}
                    onClick={() =>
                      toggleProductStatus(product._id, product.isActive)
                    }
                  >
                    {product.isActive ? "Disable" : "Enable"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add New Product Modal */}
      <Modal show={showAddProduct} onHide={() => setShowAddProduct(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddProduct
            onClose={() => setShowAddProduct(false)}
            setProducts={setProducts}
          />
        </Modal.Body>
      </Modal>

      {/* Update Product Modal */}
      <Modal
        show={showUpdateProduct}
        onHide={() => setShowUpdateProduct(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateProduct
            product={selectedProduct} // Pass selected product as prop
            onClose={() => setShowUpdateProduct(false)}
            setProducts={setProducts}
          />
        </Modal.Body>
      </Modal>

      {/* Show User Orders Modal */}
      <Modal
        show={showOrdersModal}
        onHide={() => setShowOrdersModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orders.length > 0 ? (
            <Table responsive striped bordered hover className="text-center">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User Name</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Ordered On</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{`${order.userId.firstName} ${order.userId.lastName}`}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      <span
                        className={`badge`}
                        style={{
                          backgroundColor:
                            order.status === "Pending"
                              ? "#ffc107" // Bootstrap warning color (yellow)
                              : "#28a745", // Bootstrap success color (green)
                          color: "#fff", // Ensure the text is white
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.orderedOn).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No orders found</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrdersModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
