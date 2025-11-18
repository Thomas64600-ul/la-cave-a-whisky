import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_\- ]+$/)
    .min(3)
    .max(30)
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/)
    .required(),

  role: Joi.forbidden(),

  avatar: Joi.string().uri().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  password: Joi.string().required(),
});

export const userUpdateSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_\- ]+$/)
    .min(3)
    .max(30)
    .optional(),

  email: Joi.forbidden(),
  password: Joi.forbidden(),
  role: Joi.forbidden(),

  avatar: Joi.string().uri().optional(),
});

