import React, { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order #{order._id} - Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
