import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
const allowedExtensions = [".jpeg", ".jpg", ".png", ".webp", ".avif"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Extension non supportée : ${ext}`));
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Format de fichier non supporté : ${file.mimetype}`));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});

export default upload;

export function handleUploadError(err, req, res, next) {
 
  if (err instanceof multer.MulterError) {
    return res.status(err.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Fichier trop volumineux. Limite : 10 Mo."
          : `Erreur upload : ${err.message}`,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message:
        err.message ||
        "Erreur inconnue lors de l'upload. Vérifiez le format du fichier.",
    });
  }

  next();
}


