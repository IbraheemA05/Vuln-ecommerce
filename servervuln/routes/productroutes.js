import { Router } from "express";
import {
  getMyProductsVulnerable, // Assume vulnerable controllers
  getProductByIdVulnerable,
  createProductVulnerable,
  updateMyProductVulnerable,
  deleteMyProductVulnerable,
  getAllProductsVulnerable,
  getProductsByCategoryVulnerable,
} from "../controllers/productControllerVulnerable.js";

const router = Router();


router.use(express.json()); 


router.get("/", getMyProductsVulnerable); 
router.get("/:id", getProductByIdVulnerable); 
router.post("/", createProductVulnerable);
router.get("/category/:category", getProductsByCategoryVulnerable); 
router.get("/all", getAllProductsVulnerable); 
router.put("/:id", updateMyProductVulnerable); 
router.delete("/:id", deleteMyProductVulnerable); 

export default router;