import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,                 
  message: {
    success: false,
    status: 429,
    message: "Trop de requêtes effectuées, veuillez réessayer plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next, options) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Limite globale atteinte par ${req.ip} sur ${req.originalUrl}`
      );
    }

    res.status(options.statusCode).json(options.message);
  },
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 5,                  
  message: {
    success: false,
    status: 429,
    message:
      "Trop de tentatives de connexion. Réessayez dans quelques minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    
    return req.body.email || req.ip;
  },

  handler: (req, res, next, options) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Tentatives excessives sur ${req.originalUrl} par ${req.body.email || req.ip}`
      );
    }

    res.status(options.statusCode).json(options.message);
  },
});

