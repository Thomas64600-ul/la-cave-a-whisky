import Joi from "joi";

export const userSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_\- ]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "Le nom d'utilisateur est obligatoire.",
      "string.min": "Le nom d'utilisateur doit contenir au moins 3 caractères.",
      "string.pattern.base":
        "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, espaces, tirets ou underscores.",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "L'adresse email doit être valide.",
      "string.empty": "L'email est obligatoire.",
    }),

  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule et un chiffre.",
      "string.empty": "Le mot de passe est obligatoire.",
    }),

  role: Joi.string().valid("user", "admin").optional(),

  avatar: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.uri": "L'URL de l'avatar doit être une adresse valide.",
    }),
});

export const userUpdateSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_\- ]+$/)
    .min(3)
    .max(30)
    .optional(),

  email: Joi.string().email().optional(),

  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/)
    .optional(),

  role: Joi.string().valid("user", "admin").optional(),

  avatar: Joi.string().uri().optional(),
});
