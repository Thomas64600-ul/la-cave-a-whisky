import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function registerUser(req, res) {
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

    
    const user = new User({
      username,
      email,
      password,         
      role: role || "user",
      avatar,
    });

    const newUser = await user.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = newUser.toObject();

    res.status(201).json({
      success: true,
      status: 201,
      message: "Compte créé avec succès",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error("Erreur registerUser :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Identifiants invalides",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Identifiants invalides",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = user.toObject();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Connexion réussie",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error("Erreur loginUser :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
}

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
        message: "Email, mot de passe ou rôle ne peuvent pas être modifiés ici.",
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
      message: "Erreur lors de la mise à jour",
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
      message: "Erreur lors de la suppression",
    });
  }
}
