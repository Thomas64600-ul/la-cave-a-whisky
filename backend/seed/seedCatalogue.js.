import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import CatalogueWhisky from "../models/CatalogueWhisky.js";

dotenv.config();

async function seedCatalogue() {
  try {
    console.log("Connexion à MongoDB…");
    await mongoose.connect(process.env.MONGO_URI);

    const filePath = path.resolve("./data/whiskies.json");

    console.log("Lecture du fichier JSON…");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log("Suppression du catalogue précédent…");
    await CatalogueWhisky.deleteMany({});

    console.log(`Insertion de ${data.length} whiskies dans le catalogue…`);
    await CatalogueWhisky.insertMany(data);

    console.log("Importation terminée avec succès !");
  } catch (err) {
    console.error("Erreur d’import :", err);
  } finally {
    mongoose.connection.close();
    console.log("Déconnexion de MongoDB");
  }
}

seedCatalogue();

