import Joi from "joi";

export const tastingSchema = Joi.object({
  user: Joi.string().required().messages({
    "string.empty": "L'utilisateur est obligatoire.",
  }),
  whisky: Joi.string().required().messages({
    "string.empty": "Le whisky est obligatoire.",
  }),
  rating: Joi.number().min(0).max(5).required().messages({
    "number.base": "La note doit être un nombre.",
    "number.min": "La note minimale est 0.",
    "number.max": "La note maximale est 5.",
  }),
  comment: Joi.string().max(500).allow("").optional(),
});
