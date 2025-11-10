import express from "express";
import {
  getAllTastings,
  getTastingById,
  createTasting,
  updateTasting,
  deleteTasting,
} from "../controllers/tastingController.js";

import { validate } from "../middlewares/validationMiddleware.js";
import { tastingSchema } from "../schemas/tastingSchema.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllTastings);

router.get("/:id", getTastingById);

router.post("/", protect, validate(tastingSchema), createTasting);

router.put("/:id", protect, validate(tastingSchema), updateTasting);

router.delete("/:id", protect, deleteTasting);

export default router;
