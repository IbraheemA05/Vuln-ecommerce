

import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().valid('electronics', 'clothing').required(),
  description: Joi.string().max(500).optional(),
  // Add more fields, sanitize HTML if needed with libraries like DOMPurify
});

