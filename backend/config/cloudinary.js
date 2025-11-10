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
  CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME || "manquant"}
  CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY || "manquant"}
  CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET ? "présent" : "manquant"}
  `;
  NODE_ENV === "development" ? console.warn(msg) : console.error(msg);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

if (NODE_ENV === "development") {
  cloudinary.api
    .ping()
    .then(() => console.log(`Cloudinary connecté à "${CLOUDINARY_CLOUD_NAME}"`))
    .catch((err) =>
      console.warn("Impossible de contacter Cloudinary :", err.message)
    );
}

export default cloudinary;
