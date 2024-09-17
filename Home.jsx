import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container className="text-center mt-5">
      <h1 className="display-4">Welcome to E-Commerce</h1>
      <p className="lead">Buy here</p>
      <Link to="/products">
        <Button variant="primary" size="lg" className="mb-4">
          Browse Products
        </Button>
      </Link>

      <h2 className="mt-5">Featured Products</h2>
      {/* You can add your featured products below */}
      {/* Example: */}
      {/* <Row>
          <Col><ProductCard /></Col>
          <Col><ProductCard /></Col>
          <Col><ProductCard /></Col>
        </Row> */}
    </Container>
  );
};

export default Home;
