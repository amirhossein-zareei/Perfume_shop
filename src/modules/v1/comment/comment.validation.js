const joi = require("joi");

const {
  createListOptionsValidation,
  createBodyObjectSchema,
} = require("../../../utils/validationHelpers");

const paginationSchema = createListOptionsValidation().query;
const statusSchema = joi.object({
  status: joi
    .string()
    .valid("pending", "approved", "rejected")
    .optional()
    .messages({
      "string.base": "Status must be a string.",
      "any.only":
        "Status must be one of the following: pending, approved, rejected.",
    }),
});

const getAdminCommentsValidation = {
  query: paginationSchema.concat(statusSchema),
};

module.exports = {
  getAdminCommentsValidation,
};
