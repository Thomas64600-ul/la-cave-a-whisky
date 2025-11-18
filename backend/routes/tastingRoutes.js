import express from "express";

import {
  getAllTastings,
  getTastingById,
  getUserTastings,
  getTastingsForWhisky,
  createTasting,
  updateTasting,
  deleteTasting,
} from "../controllers/tastingController.js";

import { validate } from "../middlewares/validationMiddleware.js";
import { tastingSchema, tastingUpdateSchema } from "../schemas/tastingSchema.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllTastings
);

router.get("/whisky/:whiskyId", getTastingsForWhisky);

router.get("/mine", protect, getUserTastings);

router.get("/:id", protect, getTastingById);


router.post(
  "/",
  protect,
  validate(tastingSchema),
  createTasting
);


router.put(
  "/:id",
  protect,
  validate(tastingUpdateSchema),
  updateTasting
);

router.delete(
  "/:id",
  protect,
  deleteTasting
);

export default router;



