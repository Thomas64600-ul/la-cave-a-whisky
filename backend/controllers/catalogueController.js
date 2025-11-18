import CatalogueWhisky from "../models/CatalogueWhisky.js";
import { catalogueWhiskySchema } from "../schemas/catalogueWhiskySchema.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, "..", "data", "whiskies.json");

export async function getAllCatalogue(req, res) {
  try {
    const data = await CatalogueWhisky.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("getAllCatalogue error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du catalogue.",
    });
  }
}

export async function getCatalogueById(req, res) {
  try {
    const whisky = await CatalogueWhisky.findById(req.params.id);

    if (!whisky) {
      return res.status(404).json({
        success: false,
        message: "Whisky introuvable.",
      });
    }

    res.status(200).json({ success: true, data: whisky });

  } catch (error) {
    console.error("getCatalogueById error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du whisky.",
    });
  }
}

export async function createCatalogueWhisky(req, res) {
  try {
   
    const validated = await catalogueWhiskySchema.validateAsync(req.body);

    
    const exists = await CatalogueWhisky.findOne({ name: validated.name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Un whisky portant ce nom existe déjà dans le catalogue.",
      });
    }

    const created = await CatalogueWhisky.create(validated);

    res.status(201).json({
      success: true,
      message: "Whisky ajouté au catalogue.",
      data: created,
    });

  } catch (error) {
    console.error("createCatalogueWhisky error:", error);
    res.status(400).json({
      success: false,
      message: "Impossible d’ajouter ce whisky.",
      error: error.message,
    });
  }
}

export async function updateCatalogueWhisky(req, res) {
  try {
    
    const validated = await catalogueWhiskySchema.validateAsync(req.body);

    const updated = await CatalogueWhisky.findByIdAndUpdate(
      req.params.id,
      { $set: validated },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Whisky introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Whisky mis à jour.",
      data: updated,
    });

  } catch (error) {
    console.error("updateCatalogueWhisky error:", error);
    res.status(400).json({
      success: false,
      message: "Erreur lors de la mise à jour.",
      error: error.message,
    });
  }
}

export async function deleteCatalogueWhisky(req, res) {
  try {
    const deleted = await CatalogueWhisky.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Whisky introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Whisky supprimé du catalogue.",
    });

  } catch (error) {
    console.error("deleteCatalogueWhisky error:", error);
    res.status(500).json({
      success: false,
      message: "Impossible de supprimer ce whisky.",
    });
  }
}

export async function importCatalogue(req, res) {
  try {
    const jsonData = fs.readFileSync(jsonPath, "utf8");
    const whiskies = JSON.parse(jsonData);

    let imported = 0;
    let skipped = 0;

    for (const w of whiskies) {
      try {
        const validated = await catalogueWhiskySchema.validateAsync(w);

        const exists = await CatalogueWhisky.findOne({ name: validated.name });
        if (exists) {
          skipped++;
          continue;
        }

        await CatalogueWhisky.create(validated);
        imported++;

      } catch (err) {
        skipped++;
        console.log("Whisky ignoré:", err.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "Import terminé.",
      imported,
      skipped,
    });

  } catch (error) {
    console.error("importCatalogue error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l’import.",
      error: error.message,
    });
  }
}

