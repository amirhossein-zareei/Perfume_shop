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

const changeCommentStatusValidation = {
  body: createBodyObjectSchema({
    status: joi.string().valid("approved", "rejected").required().messages({
      "string.base": "Status must be a string.",
      "any.only": "Status must be one of the following: approved, rejected.",
      "any.required": "The status field is required.",
    }),

    replyContent: joi.string().trim().min(5).max(254).optional().messages({
      "string.base": "Reply content must be a string.",
      "string.min": "Reply content cannot be empty.",
      "string.max": "Reply content cannot be longer than 1000 characters.",
    }),
  }),
};

module.exports = {
  getAdminCommentsValidation,
  changeCommentStatusValidation,
};
