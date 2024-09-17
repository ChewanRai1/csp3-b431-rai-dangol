import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const UpdateProduct = ({ product, onClose, setProducts }) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);

  // Handle form submission to update the product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/b1/products/${product._id}/update`,
        {
          name,
          description,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the product list with the modified product
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod._id === product._id
            ? { ...prod, name, description, price }
            : prod
        )
      );

      // Close the modal after submission
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          placeholder="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onClose} className="mr-2">
          Close
        </Button>
        <Button type="submit" variant="success">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default UpdateProduct;
