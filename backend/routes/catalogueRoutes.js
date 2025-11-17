import express from "express";
import {
  getAllCatalogue,
  getCatalogueById,
  createCatalogueWhisky,
  updateCatalogueWhisky,
  deleteCatalogueWhisky,
  importCatalogue
} from "../controllers/catalogueController.js";

const router = express.Router();

router.get("/", getAllCatalogue);
router.get("/:id", getCatalogueById);
router.post("/", createCatalogueWhisky);
router.put("/:id", updateCatalogueWhisky);
router.delete("/:id", deleteCatalogueWhisky);

router.post("/import", importCatalogue);

export default router;
