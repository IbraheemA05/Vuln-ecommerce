import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCart(res.data.items || []))
      .catch(() => setCart([]));
  }, []);

  const checkout = async () => {
    try {
      await axios.post(
        "/api/orders",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate("/orders");
    } catch (err) {
      alert("Checkout failed");
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.product._id}>
            {item.product.name} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}

export default Cart;
