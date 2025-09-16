import { Router } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import * as authController from "../controllers/authController.js";
import  limiter from "../models/limiter.js";

const router = Router();

router.use(helmet());
router.use(cors());

//router.use(bodyParser.json({limit: "100kb"}));
router.post("/login",express.json({ limit: "10kb" }), limiter, authController.login);
router.post("/signup",express.json({ limit: "10kb" }), limiter, authController.signup);
router.post("/reset-password",express.json({ limit: "10kb" }), limiter, authController.resetPassword);
router.post("/logout",express.json({ limit: "10kb" }), authController.logout);


export default router;