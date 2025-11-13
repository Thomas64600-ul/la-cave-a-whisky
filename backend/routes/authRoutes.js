import express from "express";
import { register, login } from "../controllers/authController.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { userSchema } from "../schemas/userSchema.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, validate(userSchema), register);

router.post("/login", authLimiter, login);

router.get("/check", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token valide",
    user: req.user,
  });
});

router.get("/check", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token valide",
    user: req.user, 
  });
});

export default router;

