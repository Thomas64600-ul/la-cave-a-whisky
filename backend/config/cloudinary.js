import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  NODE_ENV,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  const msg = `
 Cloudinary non configuré correctement.
Vérifie ton fichier .env :
  CLOUDINARY_CLOUD_NAME = ${CLOUDINARY_CLOUD_NAME ? "présent" : "manquant"}
  CLOUDINARY_API_KEY    = ${CLOUDINARY_API_KEY ? "présent" : "manquant"}
  CLOUDINARY_API_SECRET = ${CLOUDINARY_API_SECRET ? "présent" : "manquant"}
  `;
  console.warn(msg);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true, 
});

if (NODE_ENV === "development") {
  try {
    cloudinary.api
      .ping()
      .then(() =>
        console.log(`Cloudinary connecté : "${CLOUDINARY_CLOUD_NAME}"`)
      )
      .catch((err) =>
        console.warn("Impossible de contacter Cloudinary :", err.message)
      );
  } catch (err) {
    console.warn("Erreur Cloudinary :", err.message);
  }
}

export const CLOUDINARY_CONFIG = {
  name: CLOUDINARY_CLOUD_NAME,
  key: CLOUDINARY_API_KEY,
  secret: CLOUDINARY_API_SECRET ? "défini" : "manquant",
};

export default cloudinary;
