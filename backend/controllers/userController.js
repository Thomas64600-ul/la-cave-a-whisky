import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      status: 200,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Erreur getAllUsers :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la récupération des utilisateurs",
      error: error.message,
    });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      user,
    });
  } catch (error) {
    console.error("Erreur getUserById :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la récupération de l'utilisateur",
      error: error.message,
    });
  }
}

export async function createUser(req, res) {
  try {
    const { username, email, password, role, avatar } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Cet email est déjà enregistré.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      avatar,
    });

    const newUser = await user.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    if (process.env.NODE_ENV !== "production") {
      console.log(`👤 Nouvel utilisateur créé : ${user.email}`);
    }

    res.status(201).json({
      success: true,
      status: 201,
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur createUser :", error.message);
    res.status(400).json({
      success: false,
      status: 400,
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message,
    });
  }
}

export async function updateUser(req, res) {
  try {
    const { email, password, role, ...updateData } = req.body;

    if (email || password || role) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Email, mot de passe ou rôle ne peuvent pas être modifiés via cette route.",
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Utilisateur mis à jour avec succès",
      user,
    });
  } catch (error) {
    console.error("Erreur updateUser :", error.message);
    res.status(400).json({
      success: false,
      status: 400,
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error: error.message,
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Utilisateur non trouvé",
      });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`Utilisateur supprimé : ${user.email}`);
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteUser :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message,
    });
  }
}
