import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import "../config/cloudinary.js";

const CLOUDINARY_BASE_FOLDER = "cave_a_whisky";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (!cloudinary.config().cloud_name) {
      throw new Error("Cloudinary non configuré. Vérifiez votre fichier .env.");
    }

    let folder = `${CLOUDINARY_BASE_FOLDER}/uploads`;
    if (req.baseUrl.includes("whiskies")) folder = `${CLOUDINARY_BASE_FOLDER}/whiskies`;
    else if (req.baseUrl.includes("users")) folder = `${CLOUDINARY_BASE_FOLDER}/avatars`;

    const cleanName = file.originalname
      .replace(/\.[^/.]+$/, "") 
      .replace(/\s+/g, "_") 
      .replace(/[^a-zA-Z0-9_-]/g, ""); 

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1000, crop: "limit" }],
      resource_type: "image",
      public_id: `${Date.now()}_${cleanName}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error(`Format non supporté : ${file.mimetype}`));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;

export function handleUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    
    return res.status(400).json({
      success: false,
      message: `Erreur d'upload : ${err.message}`,
    });
  } else if (err) {
   
    return res.status(400).json({
      success: false,
      message: err.message || "Erreur inconnue lors de l'upload.",
    });
  }
  next();
}

