import express from "express";
import {
  getAllCatalogue,
  getCatalogueById,
  createCatalogueWhisky,
  updateCatalogueWhisky,
  deleteCatalogueWhisky,
  importCatalogue
} from "../controllers/catalogueController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.get("/", getAllCatalogue);

router.get("/:id", getCatalogueById);

router.post("/", protect, authorizeRoles("user", "admin"), createCatalogueWhisky);

router.put("/:id", protect, authorizeRoles("admin"), updateCatalogueWhisky);

router.delete("/:id", protect, authorizeRoles("admin"), deleteCatalogueWhisky);

router.post("/import", protect, authorizeRoles("admin"), importCatalogue);

export default router;
