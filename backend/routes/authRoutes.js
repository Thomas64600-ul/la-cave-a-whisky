import express from "express";
import { register, login, logout } from "../controllers/authController.js";

import { validate } from "../middlewares/validationMiddleware.js";
import { registerSchema, loginSchema } from "../schemas/userSchema.js";

import { authLimiter } from "../middlewares/rateLimiter.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), register);

router.post("/login", authLimiter, validate(loginSchema), login);

router.get("/check", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token valide",
    user: req.user,
  });
});

router.post("/logout", logout);

export default router;


