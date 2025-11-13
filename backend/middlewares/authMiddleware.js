import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export async function protect(req, res, next) {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé : aucun token fourni.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable ou supprimé.",
      });
    }

    req.user = user;
    req.token = token;

    if (process.env.NODE_ENV !== "production") {
      console.log(`Utilisateur authentifié : ${user.email} (${user.role})`);
    }

    next();
  } catch (error) {
    console.error("Erreur protect middleware :", error.message);

    let message = "Session invalide. Merci de vous reconnecter.";
    if (error.name === "TokenExpiredError") {
      message = "Session expirée. Veuillez vous reconnecter.";
    } else if (error.name === "JsonWebTokenError") {
      message = "Token invalide ou corrompu.";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
}
