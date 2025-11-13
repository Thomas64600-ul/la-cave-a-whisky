import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  statusCode: 429,
  message: {
    success: false,
    status: 429,
    message: "Trop de requêtes effectuées, veuillez réessayer plus tard.",
  },
  handler: (req, res, next, options) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Limite atteinte par ${req.ip} sur ${req.originalUrl}`);
    }
    res.status(options.statusCode).json(options.message);
  },
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    status: 429,
    message:
      "Trop de tentatives de connexion. Réessayez dans quelques minutes.",
  },
  handler: (req, res, next, options) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Tentatives excessives sur ${req.originalUrl} par ${req.ip}`);
    }
    res.status(options.statusCode).json(options.message);
  },
});
