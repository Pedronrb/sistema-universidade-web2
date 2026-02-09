import { Router } from "express";
import { authController } from "./authController.js";
import { loginLimiter } from "../../middlewares/loginLimiter.js";

const router = Router();

router.post("/login", loginLimiter, authController.login);

export default router;
