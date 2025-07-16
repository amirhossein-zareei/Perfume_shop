const joi = require("joi");
const {
  createListOptionsValidation,
} = require("../../../utils/validationHelpers");

const createBodyObjectSchema = (fields) => {
  return joi.object(fields).required().unknown(false).messages({
    "object.base": "Request body must be an object",
    "any.required": "Request body is required",
  });
};

const createCategoryValidation = {
  body: createBodyObjectSchema({
    name: joi.string().trim().min(3).max(50).required().messages({
      "string.base": "Category name must be a string.",
      "string.empty": "Category name cannot be empty.",
      "string.min": "Category name must be at least 3 characters long.",
      "string.max": "Category name cannot be longer than 50 characters.",
      "any.required": "Category name is required.",
    }),

    parentId: joi
      .string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .default(null)
      .messages({
        "string.base": "Parent ID must be a string.",
        "string.pattern.base": "Parent ID has an invalid format.",
      }),
  }),
};

module.exports = {
  createCategoryValidation,
};
