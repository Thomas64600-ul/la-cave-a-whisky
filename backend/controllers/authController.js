import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function formatUser(user) {
  if (!user) return null;
  const { password, __v, ...clean } = user.toObject();
  return clean;
}

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nom, email et mot de passe sont obligatoires.",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé.",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: "user", 
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      token,
      user: formatUser(user),
    });

  } catch (error) {
    console.error("Erreur register :", error.message);
    res.status(500).json({
      success: false,
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
        message: "Email et mot de passe requis.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Compte désactivé par un administrateur.",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides.",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user: formatUser(user),
    });

  } catch (error) {
    console.error("Erreur login :", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
}

export async function logout(req, res) {
  try {
   
    return res.status(200).json({
      success: true,
      message: "Déconnexion effectuée (token supprimé côté client).",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la déconnexion",
      error: error.message,
    });
  }
}

