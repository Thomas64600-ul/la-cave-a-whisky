export function errorHandler(err, req, res, next) {
  
  console.error("ERREUR CAPTURÉE :", {
    name: err.name,
    message: err.message,
    route: req.originalUrl,
    method: req.method,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });

  let statusCode = err.statusCode || 500;
  let message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Une erreur interne est survenue. Veuillez réessayer plus tard.";

  if (err.isJoi) {
    statusCode = 400;
    message = err.details.map((d) => d.message).join(", ");
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message =
      "Données invalides : " +
      Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "ID invalide ou format de donnée incorrect.";
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(", ");
    message = `La valeur '${field}' existe déjà dans la base de données.`;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token invalide.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Votre session a expiré. Veuillez vous reconnecter.";
  }

  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Corps JSON invalide.";
  }

  const errorId = Math.random().toString(36).substring(2, 10);

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    errorId,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

