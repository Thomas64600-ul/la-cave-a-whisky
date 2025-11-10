import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
   
    let folder = "cave_a_whisky/uploads";
    if (req.baseUrl.includes("whiskies")) folder = "cave_a_whisky/whiskies";
    else if (req.baseUrl.includes("users")) folder = "cave_a_whisky/avatars";

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1000, crop: "limit" }],
      resource_type: "image",
      public_id: `${Date.now()}-${file.originalname
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "_")}`,
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
