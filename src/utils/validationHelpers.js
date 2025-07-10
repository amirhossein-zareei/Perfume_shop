const joi = require("joi");

const createListOptionsValidation = (validSortKeys = ["newest", "oldest"]) => {
  return {
    query: joi
      .object({
        page: joi.number().integer().min(1).default(1).messages({
          "number.base": "Page must be a number.",
          "number.integer": "Page must be an integer.",
          "number.min": "Page must be at least 1.",
        }),
        limit: joi.number().integer().min(1).max(100).default(10).messages({
          "number.base": "Limit must be a number.",
          "number.integer": "Limit must be an integer.",
          "number.min": "Limit must be at least 1.",
          "number.max": "Limit cannot be greater than 100.",
        }),
        sort: joi
          .string()
          .trim()
          .valid(...validSortKeys)
          .default(validSortKeys[0])
          .messages({
            "string.base": "Sort key must be a string.",
            "any.only": `Sort key must be one of the following:${validSortKeys.join(
              ", "
            )}.`,
          }),
      })
      .unknown(false)
      .messages({
        "object.unknown":
          "You have sent a query parameter that is not allowed.",
      }),
  };
};

module.exports = {
  createListOptionsValidation,
};
