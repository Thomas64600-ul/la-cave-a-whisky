import express from "express";
import {
  getAllWhiskies,
  getWhiskyById,
  createWhisky,
  updateWhisky,
  deleteWhisky,
} from "../controllers/whiskyController.js";

import { validate } from "../middlewares/validationMiddleware.js";
import { whiskySchema } from "../schemas/whiskySchema.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import upload, { handleUploadError } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllWhiskies);

router.get("/:id", getWhiskyById);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  handleUploadError,
  validate(whiskySchema),
  createWhisky
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  handleUploadError,
  validate(whiskySchema),
  updateWhisky
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteWhisky);

export default router;
