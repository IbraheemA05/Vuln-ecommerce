import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  const addToCart = async (productId) => {
    try {
      await axios.post(
        "/api/cart",
        { productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate("/cart");
    } catch (err) {
      alert("Add to cart failed");
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => addToCart(product._id)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;
