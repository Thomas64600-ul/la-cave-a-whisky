import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { validate } from "../middlewares/validationMiddleware.js";
import { userSchema, userUpdateSchema } from "../schemas/userSchema.js"; // ✔ un seul fichier
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import upload, { handleUploadError } from "../middlewares/uploadMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, validate(userSchema), registerUser);

router.post("/login", authLimiter, loginUser);

router.get("/", protect, authorizeRoles("admin"), getAllUsers);

router.get("/:id", protect, getUserById);

router.put("/:id", protect, validate(userUpdateSchema), updateUser);

router.put(
  "/:id/avatar",
  protect,
  upload.single("avatar"),
  handleUploadError,
  updateUser
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;

