const joi = require("joi");

const {
  createListOptionsValidation,
  createParamsObjectSchema,
  createBodyObjectSchema,
} = require("../../../utils/validationHelpers");

const getOrdersValidation = createListOptionsValidation();

const orderNumberValidation = {
  params: createParamsObjectSchema({
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
  }),
};

const changeOrderStatusValidation = {
  body: createBodyObjectSchema({
    status: joi
      .string()
      .trim()
      .valid("approved", "rejected", "shipped", "delivered")
      .required()
      .messages({
        "string.base": "Status must be a string.",
        "string.empty": "Status cannot be empty.",
        "any.only":
          "Status must be one of the following values: approved, rejected, shipped, or delivered.",
        "any.required": "Status is required.",
      }),

    note: joi.string().trim().max(200).optional().messages({
      "string.base": "Note must be a string.",
      "string.max": "Note cannot exceed 200 characters.",
    }),
  }),
};

module.exports = {
  getOrdersValidation,
  orderNumberValidation,
  changeOrderStatusValidation,
};
