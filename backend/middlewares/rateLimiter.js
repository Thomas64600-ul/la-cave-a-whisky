import rateLimit from "express-rate-limit";


export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: "Trop de requêtes effectuées, veuillez réessayer plus tard.",
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 5, 
  message:
    "Trop de tentatives de connexion. Réessayez dans quelques minutes.",
});
