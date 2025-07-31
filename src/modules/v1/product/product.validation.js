const joi = require("joi");

const {
  createListOptionsValidation,
  createBodyObjectSchema,
} = require("../../../utils/validationHelpers");

const crateProductValidation = {
  body: createBodyObjectSchema({
    name: joi.string().trim().min(3).max(250).required().messages({
      "string.base": "Product name must be a string.",
      "string.empty": "Product name is required.",
      "string.min": "Product name must be at least 3 characters long.",
      "string.max": "Product name cannot be longer than 250 characters.",
      "any.required": "Product name is required.",
    }),

    description: joi.string().trim().min(10).max(5000).required().messages({
      "string.base": "Description must be a string.",
      "string.empty": "Description is required.",
      "string.min": "Description must be at least 10 characters long.",
      "string.max": "Description cannot be longer than 5000 characters.",
      "any.required": "Description is required.",
    }),

    brand: joi
      .string()
      .trim()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.base": "Brand ID must be a string.",
        "string.empty": "Brand is required.",
        "string.pattern.base": "Brand ID has an invalid format.",
        "any.required": "Brand is required.",
      }),

    categories: joi
      .array()
      .items(
        joi
          .string()
          .trim()
          .pattern(/^[0-9a-fA-F]{24}$/)
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Categories must be an array.",
        "array.min": "Product must belong to at least one category.",
        "any.required": "Categories are required.",
        "string.pattern.base": "Category ID has an invalid format.",
      }),

    volumes: joi
      .array()
      .items(
        joi.object({
          type: joi
            .string()
            .trim()
            .valid("bottle", "decant")
            .required()
            .messages({
              "any.only": 'Volume type must be either "bottle" or "decant".',
              "any.required": "Volume type is required.",
            }),

          size: joi.number().positive().required().messages({
            "number.base": "Volume size must be a number.",
            "number.positive": "Volume size must be a positive number.",
            "any.required": "Volume size is required.",
          }),

          price: joi.number().positive().required().messages({
            "number.base": "Price must be a number.",
            "number.positive": "Price must be a positive number.",
            "any.required": "Price is required.",
          }),

          stock: joi
            .number()
            .integer()
            .min(0)
            .when("type", {
              is: "bottle",
              then: joi.required(),
              otherwise: joi.optional(),
            })
            .messages({
              "number.base": "Stock must be a number.",
              "number.integer": "Stock must be an integer.",
              "number.min": "Stock must be 0 or greater.",
              "any.required": 'Stock is required for type "bottle".',
            }),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Volumes must be an array.",
        "array.min": "Product must have at least one volume.",
        "any.required": "Volumes are required.",
      }),
  }),
};

module.exports = {
  crateProductValidation,
};
