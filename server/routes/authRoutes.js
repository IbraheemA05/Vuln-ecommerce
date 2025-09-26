import { Router } from "express";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import * as authController from "../controllers/authController.js";
import  limiter from "../models/limiter.js";
import auth from "../middleware/auth.js";
import express from "express";

const router = Router();

// Security middleware
router.use(helmet());
router.use(cors({ origin: process.env.FRONTEND_URL, methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
router.use(express.json({ limit: "10kb" }));
router.use(mongoSanitize());

//Admin Authentication
const authAdmin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    next();
  };
  
//router.use(bodyParser.json({limit: "100kb"}));

//Public Router
router.post("/login",express.json({ limit: "10kb" }), limiter, authController.login);
router.post("/signup",express.json({ limit: "10kb" }), limiter, authController.signup);
router.post("/reset-password",express.json({ limit: "10kb" }), limiter, authController.resetPassword);
router.get("/logout",  authController.logout);

//Protected Router
router.use(auth)
router.get("/profile", auth, authController.getProfile);
router.put("/update-profile", auth, authController.updateProfile);
router.put("/update-role", auth, authController.updateUserRole);
router.get("/all-users", authAdmin, authController.getAllUsers);


export default router;