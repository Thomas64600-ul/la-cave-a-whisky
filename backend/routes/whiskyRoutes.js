import express from "express";

import {
  getAllWhiskies,
  getWhiskyById,
  createWhisky,
  updateWhisky,
  deleteWhisky,
  addToCave,
  updateCaveInfo,
  removeFromCave
} from "../controllers/whiskyController.js";

import { validate } from "../middlewares/validationMiddleware.js";
import { whiskySchema, whiskyUpdateSchema } from "../schemas/whiskySchema.js";

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
  validate(whiskyUpdateSchema),
  updateWhisky
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteWhisky
);

router.post(
  "/cave/:id",
  protect,
  authorizeRoles("admin"),
  addToCave
);

router.patch(
  "/cave/:id",
  protect,
  authorizeRoles("admin"),
  updateCaveInfo
);

router.delete(
  "/cave/:id",
  protect,
  authorizeRoles("admin"),
  removeFromCave
);

export default router;


