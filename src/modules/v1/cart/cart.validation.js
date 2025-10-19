const joi = require("joi");

const { createBodyObjectSchema } = require("../../../utils/validationHelpers");

const cartItemsValidation = {
  body: createBodyObjectSchema({
    productId: joi.string().hex().length(24).required().messages({
      "string.base": "Product ID must be a string.",
      "string.length": "Product ID must be 24 characters long.",
      "any.required": "Product ID is required.",
    }),

    volumeId: joi.string().hex().length(24).required().messages({
      "string.base": "Volume ID must be a string.",
      "string.length": "Volume ID must be 24 characters long.",
      "any.required": "Volume ID is required.",
    }),

    quantity: joi.number().integer().min(1).max(10).default(1).messages({
      "number.base": "Quantity must be a number.",
      "number.integer": "Quantity must be an integer.",
      "number.min": "Quantity must be at least 1.",
      "number.max": "Quantity cannot be more than 10.",
    }),
  }),
};

const quantityValidation = {
  body: createBodyObjectSchema({
    quantity: joi.number().integer().min(1).max(10).default(1).messages({
      "number.base": "Quantity must be a number.",
      "number.integer": "Quantity must be an integer.",
      "number.min": "Quantity must be at least 1.",
      "number.max": "Quantity cannot be more than 10.",
    }),
  }),
};


module.exports = {
  cartItemsValidation,
  quantityValidation,
};
