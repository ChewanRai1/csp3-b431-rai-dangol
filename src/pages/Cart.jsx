import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming user token is stored in localStorage
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/b1/carts/get-cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCart(response.data.cart);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      if (newQuantity > 0) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/b1/carts/update-cart-quantity`,
          {
            productId,
            quantity: newQuantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Update the cart in the frontend
        const updatedCartItems = cart.cartItems.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: newQuantity,
                subtotal: newQuantity * item.price,
              }
            : item
        );
        const updatedTotalPrice = updatedCartItems.reduce(
          (acc, item) => acc + item.subtotal,
          0
        );
        setCart({
          ...cart,
          cartItems: updatedCartItems,
          totalPrice: updatedTotalPrice,
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/b1/carts/${productId}/remove-from-cart`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update cart state after removing the item
      const updatedCartItems = cart.cartItems.filter(
        (item) => item.productId !== productId
      );

      const updatedTotalPrice = updatedCartItems.reduce(
        (acc, item) => acc + item.subtotal,
        0
      );

      setCart({
        ...cart,
        cartItems: updatedCartItems,
        totalPrice: updatedTotalPrice,
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/b1/carts/clear-cart`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(null); // Clear the cart from state after clearing it from the server
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/b1/orders/checkout`,
        {}, // No body data needed, the backend handles everything
        // null, // No additional data needed as cart is taken from the backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // After successful checkout, clear the cart from the frontend
      setCart(null);
      alert("Order placed successfully!"); // Notify the user

      // Optionally redirect the user to a confirmation page or orders page
      // navigate("/my-orders"); // If using react-router for navigation
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Your Shopping Cart</h2>
      {cart && cart.cartItems.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.cartItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <Link to={`/products/${item.productId._id}`}>
                    {item.name}
                  </Link>
                </td>
                <td>${item.price}</td>
                <td>
                  <div className="quantity-control">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.productId,
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td>${item.subtotal}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Your cart is empty.</p>
      )}
      {cart && cart.cartItems.length > 0 && (
        <>
          <h3>Total: ${cart.totalPrice}</h3>
          <Button variant="success" className="mr-2" onClick={handleCheckout}>
            Checkout
          </Button>
          <Button variant="danger" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </>
      )}
    </Container>
  );
};

export default Cart;
