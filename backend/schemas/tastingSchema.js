import Joi from "joi";

export const tastingSchema = Joi.object({
  whisky: Joi.string()
    .required()
    .messages({
      "string.empty": "Le whisky est obligatoire.",
    }),

  rating: Joi.number()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.base": "La note doit être un nombre.",
      "number.min": "La note minimale est 1.",
      "number.max": "La note maximale est 5.",
      "any.required": "La note est obligatoire.",
    }),

  comment: Joi.string()
    .max(500)
    .allow("")
    .optional()
    .messages({
      "string.max": "Le commentaire ne peut pas dépasser 500 caractères.",
    }),
});
