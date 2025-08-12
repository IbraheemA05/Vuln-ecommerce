import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().required().trim(),
  password: Joi.string().required(),
});

export const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  confirmPassword: Joi.valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
  role: Joi.string().valid("vendor", "customer").required(),
});