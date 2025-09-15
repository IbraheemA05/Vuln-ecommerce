import { Router } from "express";
import * as authController from "../controllers/authController.js";
import  limiter from "../models/limiter.js";
const router = Router();

router.post("/login", limiter, authController.login);
router.post("/signup", limiter, authController.signup);
router.post("/reset-password", limiter, authController.resetPassword);
router.post("/logout", authController.logout);


export default router;