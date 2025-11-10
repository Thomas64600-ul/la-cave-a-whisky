export function errorHandler(err, req, res, next) {
  
  console.error("Erreur capturée :", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    route: req.originalUrl,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Une erreur interne est survenue. Veuillez réessayer plus tard.";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
