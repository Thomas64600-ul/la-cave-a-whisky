import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Accès non autorisé : token manquant",
    });
  }

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (process.env.NODE_ENV !== "production") {
      console.log("🔐 TOKEN OK :", token);
      console.log("🧑‍💻 USER ID DANS TOKEN :", decoded.userId);
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable ou supprimé.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Ce compte a été désactivé par un administrateur.",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error("Erreur protect middleware :", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expirée. Veuillez vous reconnecter.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Token invalide.",
    });
  }
};
