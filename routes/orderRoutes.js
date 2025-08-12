import { Router } from "express";
import {order} from "../controllers/orderController.js";
import {trackOrder} from "../controllers/orderController.js";

import auth from "../middleware/auth.js";

const router = Router()

router.use(auth);

router.post("/", order);
router.get("/trackorder/:orderId", trackOrder);