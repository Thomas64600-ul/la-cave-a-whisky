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

    if (process.env.NODE_ENV !== "production") {
      console.log("Utilisateur authentifié :", user.email);
    }

    next(); 
  } catch (error) {
    console.error("Erreur protect middleware :", error.message);

    const msg =
      error.name === "TokenExpiredError"
        ? "Session expirée. Veuillez vous reconnecter."
        : "Session invalide. Merci de vous reconnecter.";

    return res.status(401).json({ success: false, message: msg });
  }
}
