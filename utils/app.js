import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js"; // Import your routes
import services from "./routes/productRoute.js"
import connectDB from "./config/db.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
// Connect to the database
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));

// Connect routes to the app
app.use("/api/auth", authRoutes);

import productRoutes from './routes/productRoute.js';
app.use('/api/products', productRoutes);


import cartRoutes from './routes/cartRoutes.js';
app.use('/api/cart', cartRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
