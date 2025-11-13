import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET manquant dans le fichier .env");
  }

  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } 
  );
}

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Tous les champs sont requis.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Cet email est déjà utilisé.",
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role: "user",
    });

    const token = generateToken(newUser);

    if (process.env.NODE_ENV !== "production") {
      console.log(`👤 Nouvel utilisateur inscrit : ${newUser.email}`);
    }

    res.status(201).json({
      success: true,
      status: 201,
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erreur register :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Email et mot de passe requis.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Utilisateur non trouvé.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Mot de passe incorrect.",
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log(`Connexion réussie : ${user.email}`);
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur login :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      status: 200,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la déconnexion",
      error: error.message,
    });
  }
}

