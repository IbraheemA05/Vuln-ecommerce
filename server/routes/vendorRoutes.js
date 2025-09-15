    import { Router } from "express";
    import vendorAuth from "../middleware/Vendorauth.js";
    import * as authController from "../controllers/authController.js";
    import vendorController from "../controllers/vendorController.js";

    const router = Router();

    router.post("/login", authController.login);
    router.post("/signup", authController.signup);

    router.use(vendorAuth);

    router.get("/me", vendorController.getMyVendorProfile);
    router.put("/me", vendorController.updateMyVendorProfile);
    router.delete("/me", vendorController.deleteMyVendorAccount);

    export default router;
