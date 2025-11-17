import Joi from "joi";

export const catalogueWhiskySchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.empty": "Le nom est obligatoire",
  }),

  brand: Joi.string().min(2).required().messages({
    "string.empty": "La marque est obligatoire",
  }),

  country: Joi.string().min(2).required().messages({
    "string.empty": "Le pays est obligatoire",
  }),

  category: Joi.string().min(2).required().messages({
    "string.empty": "La catégorie est obligatoire (Single Malt, Blend, etc.)",
  }),

  degree: Joi.number().min(0).max(80).required().messages({
    "any.required": "Le degré alcoolique est obligatoire",
  }),

  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).allow(null),

  description: Joi.string().allow("", null),

  image: Joi.string().uri().allow("", null),
});

