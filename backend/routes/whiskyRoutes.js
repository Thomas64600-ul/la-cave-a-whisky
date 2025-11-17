import express from "express";

import {
  getAllWhiskies,
  getWhiskyById,
  createWhisky,
  updateWhisky,
  deleteWhisky,
} from "../controllers/whiskyController.js";

import { validate } from "../middlewares/validationMiddleware.js";
import { whiskySchema, whiskyUpdateSchema } from "../schemas/whiskySchema.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

import upload, { handleUploadError } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/public/whiskyhunter", async (req, res) => {
  try {
    console.log("Appel API WhiskyHunter…");

    const response = await fetch("https://whiskyhunter.net/api/retail/latest/20", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    console.log("Status reçu :", response.status);
    const text = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        message: `Erreur API WhiskyHunter : ${response.status}`,
        raw: text,
      });
    }

    const data = JSON.parse(text);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });

  } catch (error) {
    console.error("ERREUR API :", error);
    res.status(500).json({
      success: false,
      message: "Impossible d’interroger WhiskyHunter",
      error: error.message,
    });
  }
});

router.get("/", getAllWhiskies);

router.get("/:id", getWhiskyById);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  validate(whiskySchema),         
  upload.single("image"),        
  handleUploadError,
  createWhisky
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validate(whiskyUpdateSchema),   
  upload.single("image"),
  handleUploadError,
  updateWhisky
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteWhisky
);

export default router;
