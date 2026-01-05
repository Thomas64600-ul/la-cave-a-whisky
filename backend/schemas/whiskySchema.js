import Joi from "joi";

export const whiskySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  brand: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(50).required(),
  category: Joi.string().min(2).max(50).required(),
  degree: Joi.number().min(0).max(100).required(),

  age: Joi.number().integer().min(0).max(100).allow(null),

  price: Joi.number().min(0).required(),

  purchasePlace: Joi.string().min(2).max(100).required(),


  description: Joi.string().allow("").max(2000).optional(),
  image: Joi.string().allow("").allow(null).optional(),

  inCave: Joi.boolean().default(false),
  bottleCount: Joi.number().integer().min(0).default(0),
  caveNotes: Joi.string().allow("").default(""),
});

export const whiskyUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  brand: Joi.string().min(2).max(100).optional(),
  country: Joi.string().min(2).max(50).optional(),
  category: Joi.string().min(2).max(50).optional(),
  degree: Joi.number().min(0).max(100).optional(),

  age: Joi.number().integer().min(0).max(100).allow(null),

  price: Joi.number().min(0).optional(),

  purchasePlace: Joi.string().min(2).max(100).optional(),


  description: Joi.string().allow("").max(2000).optional(),
  image: Joi.string().allow("").allow(null).optional(),

  inCave: Joi.boolean().optional(),
  bottleCount: Joi.number().integer().min(0).optional(),
  caveNotes: Joi.string().allow("").optional(),
});

