import { Router } from "express";
import {
  getMyProducts,
  getProductById,
  createProduct,
  updateMyProduct,
  deleteMyProduct,
  getAllProducts,
} from "../controllers/productController.js";

import auth from "../middleware/auth.js";

const router = Router()

router.use(auth);

router.get("/", getMyProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.get("/all", getAllProducts); 
router.put("/:id", updateMyProduct);
router.delete("/:id", deleteMyProduct);

export default router;
