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

res.cookie("token", token, {
  httpOnly: true,
  secure: false,      
  sameSite: "lax",    
  path: "/",
});


    return res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      user: formatUser(user),
    });

  } catch (error) {
    console.error("Erreur register :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
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

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides.",
      });
    }

    const token = generateToken(user);

res.cookie("token", token, {
  httpOnly: true,
  secure: false,       
  sameSite: "lax",     
  path: "/",
});



    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      user: formatUser(user),
    });

  } catch (error) {
    console.error("Erreur login :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
    });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token", { path: "/" });

    return res.status(200).json({
      success: true,
      message: "Déconnexion effectuée",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la déconnexion",
    });
  }
}



