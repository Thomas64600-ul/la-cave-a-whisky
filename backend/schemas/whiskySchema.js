import Joi from "joi";

export const whiskySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  origin: Joi.string().pattern(/^[a-zA-ZÀ-ÿ' -]+$/).min(2).max(50).required(),
  degree: Joi.number().min(0).max(100).required(),
  description: Joi.string().allow("").max(1000).optional(),
  image: Joi.string().uri().optional(),
});

export const whiskyUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  origin: Joi.string().pattern(/^[a-zA-ZÀ-ÿ' -]+$/).min(2).max(50).optional(),
  degree: Joi.number().min(0).max(100).optional(),
  description: Joi.string().allow("").max(1000).optional(),
  image: Joi.string().uri().optional(),
});

