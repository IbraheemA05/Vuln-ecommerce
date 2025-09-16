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
import helmet from "helmet";

const router = Router()
router.use(helmet());
router.use(express.json({ limit: "10kb" }));

router.use(auth);
router.get("/", getMyProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.get("/all", getAllProducts); 
router.put("/:id", updateMyProduct);
router.delete("/:id", deleteMyProduct);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export default router;
