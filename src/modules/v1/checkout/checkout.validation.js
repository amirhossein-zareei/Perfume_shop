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

    currency: joi
      .string()
      .trim()
      .valid(
        "USD", // United States - Dollar
        "EUR", // European Union - Euro
        "GBP", // United Kingdom - Pound Sterling
        "JPY", // Japan - Yen
        "AUD", // Australia - Dollar
        "CAD", // Canada - Dollar
        "CHF", // Switzerland - Franc
        "CNY", // China - Yuan (Renminbi)
        "INR", // India - Rupee
        "BRL" // Brazil - Real
      )
      .messages({
        "string.base": "Currency must be a string.",
        "string.empty": "Currency cannot be empty.",
        "any.only": "Currency must be one of the supported currencies.",
      }),
  }),
};

module.exports = { updateCheckoutValidation };
