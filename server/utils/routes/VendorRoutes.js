import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import * as authController from "../controllers/authController.js";
import vendorController from "../controllers/vendorController.js";

const router = Router();

router.post('/login', authController.loginVendor);
router.post('/signup', authController.signupVendor);

router.use(protect, restrictTo("vendor"));

router.get("/me", vendorController.getMyVendorProfile);
router.put("/me", vendorController.updateMyVendorProfile);
router.delete("/me", vendorController.deleteMyVendorAccount);
