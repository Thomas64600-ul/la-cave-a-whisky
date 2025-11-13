export function validate(schema, source = "body") {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error } = schema.validate(dataToValidate, {
      abortEarly: process.env.NODE_ENV === "production", 
      allowUnknown: false, 
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        status: 400,
        message: "Erreur de validation des données.",
        errors,
      });
    }

    next();
  };
}
