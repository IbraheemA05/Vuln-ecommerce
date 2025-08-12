import { Router } from "express";
import { getCart, addToCart, removeFromCart, updateCartItem, getCartByUserId } from "../controllers/cartController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.use(auth);

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.put("/update", updateCartItem);
router.get("/user/:userId", async (req, res) => {
  try {
    const cart = await getCartByUserId(req.params.userId);
    res.status(200).json(cart);
  } catch (error) { 
    res.status(500).json({ message: error.message });
  }
});

export default router;