import Joi from "joi";

export const whiskySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Le nom du whisky est obligatoire.",
      "string.min": "Le nom du whisky doit contenir au moins 2 caractères.",
      "string.max": "Le nom du whisky ne peut pas dépasser 100 caractères.",
    }),

  origin: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÿ' -]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "L'origine du whisky est obligatoire.",
      "string.pattern.base": "L'origine ne peut contenir que des lettres, espaces et tirets.",
    }),

  degree: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      "number.base": "Le degré doit être un nombre.",
      "number.min": "Le degré ne peut pas être négatif.",
      "number.max": "Le degré ne peut pas dépasser 100.",
    }),

  description: Joi.string()
    .allow("")
    .max(1000)
    .optional()
    .messages({
      "string.max": "La description ne peut pas dépasser 1000 caractères.",
    }),

  image: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.uri": "L'image doit être une URL valide.",
    }),
});

