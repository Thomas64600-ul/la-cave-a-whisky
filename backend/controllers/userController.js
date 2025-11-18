import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

function formatUser(user) {
  const { password, __v, ...clean } = user.toObject();
  return clean;
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
    });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(formatUser),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
    });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur",
    });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez modifier que votre propre compte.",
      });
    }

    const forbidden = ["email", "password", "role"];
    for (const f of forbidden) {
      if (req.body[f]) {
        return res.status(400).json({
          success: false,
          message: `${f} ne peut pas être modifié.`,
        });
      }
    }

    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Profil mis à jour",
      user: formatUser(user),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Erreur lors de la mise à jour",
    });
  }
}

export async function updateAvatar(req, res) {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez modifier que votre propre avatar.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucune image envoyée.",
      });
    }

    const upload = await cloudinary.uploader.upload_stream(
      {
        folder: "cave_a_whisky/avatars",
        transformation: [{ width: 600, crop: "limit" }],
      },
      async (error, result) => {
        if (error)
          return res.status(400).json({ success: false, message: error.message });

        const user = await User.findByIdAndUpdate(
          id,
          { avatar: result.secure_url },
          { new: true }
        );

        res.status(200).json({
          success: true,
          message: "Avatar mis à jour",
          user: formatUser(user),
        });
      }
    );

    upload.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du changement d'avatar",
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur supprimé",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression",
    });
  }
}

