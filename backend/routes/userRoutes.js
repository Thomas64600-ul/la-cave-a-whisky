import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { validate } from "../middlewares/validationMiddleware.js";
import { userSchema } from "../schemas/userSchema.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAllUsers);

router.get("/:id", protect, getUserById);

router.post("/", authLimiter, validate(userSchema), createUser);

router.put("/:id", protect, validate(userSchema), updateUser);

router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

router.put("/:id/avatar", protect, upload.single("avatar"), updateUser);

export default router;
