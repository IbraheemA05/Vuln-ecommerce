import { Router } from "express";
import { placeOrder, trackorder } from "../controllers/orderController.js";

import auth from "../middleware/auth.js";

const router = Router();

router.use(auth);

router.post("/", placeOrder);
router.get("/trackorder/:id", trackorder);

export default router;
