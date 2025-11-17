import Joi from "joi";

export const whiskySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  brand: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(50).required(),
  category: Joi.string().min(2).max(50).required(),
  degree: Joi.number().min(0).max(100).required(),
  year: Joi.number().min(1900).max(2100).allow(null).optional(),
  description: Joi.string().allow("").max(2000).optional(),
  image: Joi.string().allow("").allow(null).optional(),
});

export const whiskyUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  brand: Joi.string().min(2).max(100).optional(),
  country: Joi.string().min(2).max(50).optional(),
  category: Joi.string().min(2).max(50).optional(),
  degree: Joi.number().min(0).max(100).optional(),
  year: Joi.number().min(1900).max(2100).allow(null).optional(),
  description: Joi.string().allow("").max(2000).optional(),
  image: Joi.string().allow("").allow(null).optional(),
});
