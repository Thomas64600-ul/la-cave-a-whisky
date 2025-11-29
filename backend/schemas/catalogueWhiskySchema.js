import Joi from "joi";

export const catalogueWhiskySchema = Joi.object({
  name: Joi.string().min(2).required(),
  brand: Joi.string().min(2).required(),
  country: Joi.string().min(2).required(),
  category: Joi.string().min(2).required(),
  degree: Joi.number().min(0).max(80).required(),

  age: Joi.number().integer().min(0).max(100).allow(null),

  year: Joi.number().integer().min(1800).max(2100).allow(null),

  description: Joi.string().allow("", null),
  image: Joi.string().uri().allow("", null),
});


