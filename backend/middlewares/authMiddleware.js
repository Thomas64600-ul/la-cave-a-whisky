import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Accès non autorisé : token manquant",
    });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN REÇU :", token);
    console.log("ID DANS TOKEN :", decoded.userId);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable ou supprimé.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Erreur protect middleware :", error.message);
    return res.status(401).json({
      success: false,
      message: "Token invalide",
    });
  }
};
