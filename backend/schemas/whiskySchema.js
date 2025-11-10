import Joi from "joi";

export const whiskySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Le nom du whisky est obligatoire.",
  }),
  origin: Joi.string().min(2).max(50).required(),
  degree: Joi.number().min(0).max(100).required().messages({
    "number.base": "Le degré doit être un nombre.",
  }),
  description: Joi.string().max(1000).optional(),
  imageUrl: Joi.string().uri().optional(),
});
