import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
// ProductCatalog component
const ProductCatalog = () => {
  // State to store products
  const [products, setProducts] = useState([]);

  // Fetch active products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/b1/products/active`
        );
        console.log("API response:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Our Products</h2>
      <Row>
        {Array.isArray(products) &&
          products.map((product) => (
            <Col md={4} key={product._id}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-center">
                    {product.name}
                  </Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <h4 className="text-center text-danger">${product.price}</h4>
                  <Button
                    variant="primary"
                    as={Link}
                    to={`/product-details/${product._id}`}
                  >
                    Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default ProductCatalog;
