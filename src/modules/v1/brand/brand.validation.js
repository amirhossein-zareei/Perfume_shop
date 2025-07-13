const joi = require("joi");

const createBodyObjectSchema = (fields) => {
  return joi.object(fields).required().unknown(false).messages({
    "object.base": "Request body must be an object",
    "any.required": "Request body is required",
  });
};

const createBrandValidation = {
  body: createBodyObjectSchema({
    name: joi.string().trim().min(2).max(50).required().messages({
      "string.base": "Brand name must be a string.",
      "string.empty": "Brand name is required.",
      "string.min": "Brand name must be at least 2 characters long.",
      "string.max": "Brand name must not exceed 50 characters.",
      "any.required": "Brand name is required.",
    }),

    content: joi.string().trim().min(10).required().messages({
      "string.base": "Content must be a string.",
      "string.empty": "Content is required.",
      "string.min": "Content must be at least 10 characters long.",
      "any.required": "Content is required.",
    }),

    website: joi.string().trim().uri().required().messages({
      "string.base": "Website must be a string.",
      "string.empty": "Website URL is required.",
      "string.uri":
        "Please enter a valid website URL (e.g., https://example.com).",
      "any.required": "Website URL is required.",
    }),
  }),
};

module.exports = {
  createBrandValidation,
};
