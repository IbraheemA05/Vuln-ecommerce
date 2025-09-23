import { Router } from "express";
import mongoSanitize from "express-mongo-sanitize";
import { getCart, addToCart, removeFromCart, updateCartItem, getCartByUserId } from "../controllers/cartController.js";
import auth from "../middleware/auth.js";
import Joi from "joi";
import limiter from "../models/limiter.js"
import cors from "cors";
import helmet from "helmet";
import express from "express";


const router = Router();

const cartItemSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  quantity: Joi.number().integer().min(1).max(100).required(),
});

const removeItemSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

const validateCartItem = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

router.use(helmet());
//router.use(cors({ origin: process.env.FRONTEND_URL, methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
router.use(express.json({ limit: "10kb" }));
router.use(mongoSanitize());
router.use(auth);

router.get("/", getCart);
router.post("/", validateCartItem(cartItemSchema), limiter, addToCart);
router.delete("/remove", validateCartItem(removeItemSchema), limiter, removeFromCart);
router.put("/update", validateCartItem(cartItemSchema), limiter, updateCartItem);

export default router;