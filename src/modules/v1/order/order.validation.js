const joi = require("joi");

const {
  createListOptionsValidation,
  createParamsObjectSchema,
  createBodyObjectSchema,
} = require("../../../utils/validationHelpers");

const getOrdersValidation = createListOptionsValidation();

const orderNumberValidation = createParamsObjectSchema({
  orderNumber: joi
    .string()
    .trim()
    .pattern(/^ORD-\d{13}-\d+$/)
    .required()
    .messages({
      "string.base": "Order Number must be a string.",
      "string.empty": "Order Number cannot be empty.",
      "string.pattern.base":
        "Order Number must follow the format 'ORD-YYYYMMDDHHMMSS-XXXX'.",
      "any.required": "Order Number is required.",
    }),
});

module.exports = {
  getOrdersValidation,
  orderNumberValidation,
};
