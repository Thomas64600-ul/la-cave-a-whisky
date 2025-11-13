import Joi from "joi";

export const userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("user", "admin").optional(),
  avatar: Joi.string().uri().optional(),
});
