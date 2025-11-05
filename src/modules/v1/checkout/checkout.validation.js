const joi = require("joi");

const { createBodyObjectSchema } = require("../../../utils/validationHelpers");

const updateCheckoutValidation = {
  body: createBodyObjectSchema({
    addressId: joi.string().trim().hex().length(24).messages({
      "string.base": "Address ID must be a string.",
      "string.empty": "Address ID cannot be empty.",
      "string.hex": "Address ID must be a valid hexadecimal string.",
      "string.length": "Address ID must be 24 characters long.",
    }),

    paymentMethod: joi.string().trim().valid("paypal", "stripe").messages({
      "string.base": "Payment Method must be a string.",
      "string.empty": "Payment Method cannot be empty.",
      "any.only": "Payment Method must be either 'paypal' or 'stripe'.",
    }),
  }),
};

const verifyPaymentValidation = {
  query: joi.object({
    sessionId: joi
      .string()
      .trim()
      .min(17)
      .max(100)
      .required()
      .messages({
        "string.alphanum": "Session ID must contain only letters and numbers.",
        "string.min": "Session ID must be at least 17 characters.",
        "string.max": "Session ID must not exceed 100 characters.",
        "any.required": "Session ID is required.",
      }),
  }),
};

module.exports = { updateCheckoutValidation, verifyPaymentValidation };
