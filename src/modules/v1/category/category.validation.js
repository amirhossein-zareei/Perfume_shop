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

const getCategoriesValidation = createListOptionsValidation;

const slugValidation = {
  params: joi.object({
    slug: joi.string().trim().min(2).max(50).required().messages({
      "string.base": "Category slug must be a string.",
      "string.empty": "Category slug is required.",
      "string.min": "Category slug must be at least 2 characters long.",
      "string.max": "Category slug must not exceed 50 characters.",
      "any.required": "Category slug is required.",
    }),
  }),
};

const updatedCategoryValidation = {
  body: createBodyObjectSchema({
    name: joi.string().trim().min(3).max(50).messages({
      "string.base": "Category name must be a string.",
      "string.empty": "Category name cannot be empty.",
      "string.min": "Category name must be at least 3 characters long.",
      "string.max": "Category name cannot be longer than 50 characters.",
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

  params: slugValidation.params,
};

module.exports = {
  createCategoryValidation,
  getCategoriesValidation,
  slugValidation,
  updatedCategoryValidation,
};
