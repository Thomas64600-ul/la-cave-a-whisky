import Whisky from "../models/Whisky.js";
import { v2 as cloudinary } from "cloudinary";

async function uploadToCloudinary(fileBuffer, folder = "cave_a_whisky/whiskies") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ width: 1000, crop: "limit" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}

export async function getAllWhiskies(req, res) {
  try {
    const whiskies = await Whisky.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      status: 200,
      count: whiskies.length,
      data: whiskies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la récupération des whiskies",
      error: error.message,
    });
  }
}

export async function getWhiskyById(req, res) {
  try {
    const whisky = await Whisky.findById(req.params.id);

    if (!whisky) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Whisky non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: whisky,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la récupération du whisky",
      error: error.message,
    });
  }
}

export async function createWhisky(req, res) {
  try {
    const { name, brand, country, category, degree, year, description } = req.body;

  
    if (!name || !brand || !country || !category || !degree) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Les champs name, brand, country, category et degree sont obligatoires.",
      });
    }

    const existing = await Whisky.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Un whisky portant ce nom existe déjà.",
      });
    }

    let imageUrl = req.body.image || null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const newWhisky = await Whisky.create({
      name,
      brand,
      country,
      category,
      degree,
      year: year || null,
      description,
      image: imageUrl,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: "Whisky créé avec succès",
      data: newWhisky,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      message: "Erreur lors de la création du whisky",
      error: error.message,
    });
  }
}

export async function updateWhisky(req, res) {
  try {
    const { id } = req.params;

    let updateData = { ...req.body };

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer);
    }

    const whisky = await Whisky.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!whisky) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Whisky non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Whisky mis à jour avec succès",
      data: whisky,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      message: "Erreur lors de la mise à jour",
      error: error.message,
    });
  }
}

export async function deleteWhisky(req, res) {
  try {
    const whisky = await Whisky.findByIdAndDelete(req.params.id);

    if (!whisky) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Whisky non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Whisky supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la suppression",
      error: error.message,
    });
  }
}

