import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateAvatar,
  getMe,
} from "../controllers/userController.js";

import { validate } from "../middlewares/validationMiddleware.js";
import { userUpdateSchema } from "../schemas/userSchema.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import upload, { handleUploadError } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);

router.get("/", protect, authorizeRoles("admin"), getAllUsers);

router.get("/:id", protect, getUserById);

router.put(
  "/:id",
  protect,
  validate(userUpdateSchema),
  updateUser
);

router.put(
  "/:id/avatar",
  protect,
  upload.single("avatar"),
  handleUploadError,
  updateAvatar
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;

