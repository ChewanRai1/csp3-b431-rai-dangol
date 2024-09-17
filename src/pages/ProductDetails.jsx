import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { productId } = useParams(); // Get product ID from route parameters
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1); // Default quantity

  // Fetch the product details based on productId
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/b1/products/${productId}`
        );
        setProduct(response.data); // Assuming the backend returns the product object
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  // Function to add product to the cart
  const addToCart = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/b1/carts/add-to-cart`,
        {
          productId: product._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  // Function to handle increment and decrement of quantity
  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Container className="mt-5">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h4>
        Price: <span style={{ color: "orange" }}>${product.price}</span>
      </h4>
      <div className="d-flex align-items-center mb-3">
        <h5 className="mr-3">Quantity:</h5>
        <Button
          variant="dark"
          onClick={() => handleQuantityChange("decrement")}
        >
          -
        </Button>
        <span className="mx-2">{quantity}</span>
        <Button variant="dark" onClick={() => handleQuantityChange("increment")}>
          +
        </Button>
      </div>
      <Button variant="primary" onClick={addToCart}>
        Add to Cart
      </Button>
    </Container>
  );
};

export default ProductDetails;