const joi = require("joi");

const { createBodyObjectSchema } = require("../../../utils/validationHelpers");

const contactValidation = {
  body: createBodyObjectSchema({
    email: joi
      .string()
      .email()
      .lowercase()
      .required()
      .messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
      }),

    message: joi.string().trim().min(10).max(1000).required().messages({
      "string.base": "Message must be a string",
      "string.empty": "Message is required",
      "string.min": "Message must be at least 10 characters long",
      "string.max": "Message must not exceed 1000 characters",
      "any.required": "Message is required",
    }),
  }),
};

module.exports = {
    contactValidation,
}
