import { Router } from "express";
import limiter from "../models/limiter.js";
import {
  getMyProducts,
  getProductById,
  createProduct,
  updateMyProduct,
  deleteMyProduct,
  getAllProducts,
} from "../controllers/productController.js";
import auth from "../middleware/auth.js";
import helmet from "helmet";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
const router = Router()


router.use(helmet());
router.use(express.json({ limit: "10kb" }));
router.use(auth);
router.use(mongoSanitize());

router.get("/", getMyProducts);
router.get("/:id", getProductById);
router.post("/", limiter ,  createProduct);
router.get("/all", limiter,  getAllProducts); 
router.put("/:id", updateMyProduct);
router.delete("/:id", deleteMyProduct);


``
router.get("/products/all", getAllProducts);
//router.get("/products/category/:category", getProductsByCategory);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export default router;
