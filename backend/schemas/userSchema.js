import Joi from "joi";

export const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Le nom d'utilisateur est obligatoire.",
    "string.min": "Le nom d'utilisateur doit contenir au moins 3 caractères.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "L'adresse email doit être valide.",
    "string.empty": "L'email est obligatoire.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Le mot de passe doit faire au moins 6 caractères.",
  }),
  role: Joi.string().valid("user", "admin").default("user"),
  avatar: Joi.string().uri().optional(),
});
