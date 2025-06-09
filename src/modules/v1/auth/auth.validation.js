const joi = require("joi");

const createBaseObjectSchema = (fields) => {
  return joi.object(fields).required().unknown(false).messages({
    "object.base": "Request body must be an object",
    "any.required": "Request body is required",
  });
};

const passwordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@_#\$!])[A-Za-z\d@_#\$!]{8,64}$/;

const registerValidation = {
  body: createBaseObjectSchema({
    name: joi
      .string()
      .trim()
      .min(3)
      .max(25)
      .pattern(/^[^0-9"']+$/)
      .required()
      .messages({
        "string.base": "Name must be a string",
        "string.empty": "Name is required",
        "string.pattern.base": "Name must not contain numbers or quotes",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must not exceed 25 characters",
        "any.required": "Name is required",
      }),

    email: joi
      .string()
      .email({ minDomainSegments: 2 })
      .lowercase()
      .required()
      .messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
      }),

    password: joi
      .string()
      .trim()
      .min(8)
      .max(64)
      .pattern(passwordPattern)
      .required()
      .messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must not exceed 64 characters",
        "string.pattern.base":
          "Password must contain letters, numbers, and at least one special character (@, _, #, $, !)",
        "any.required": "Password is required",
      }),

    confirmPassword: joi
      .string()
      .equal(joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm Password must match Password",
        "any.required": "Confirm Password is required",
      }),

    captcha: joi
      .string()
      .trim()
      .pattern(/^[0-9A-za-z]{5}$/)
      .required()
      .messages({
        "string.base": "CAPTCHA must be a string",
        "string.empty": "CAPTCHA is required",
        "string.pattern.base":
          "CAPTCHA must be exactly 5 alphanumeric characters",
        "any.required": "CAPTCHA is required",
      }),

    uuid: joi.string().uuid().required().messages({
      "string.base": "UUID must be a string",
      "string.empty": "UUID cannot be empty",
      "string.guid": "UUID must be a valid UUID",
      "any.required": "UUID is required",
    }),
  }),
};

const loginValidation = {
  body: createBaseObjectSchema({
    email: joi
      .string()
      .email({ minDomainSegments: 2 })
      .lowercase()
      .required()
      .messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
      }),
    password: joi
      .string()
      .trim()
      .min(8)
      .max(64)
      .pattern(passwordPattern)
      .required()
      .messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must not exceed 64 characters",
        "string.pattern.base":
          "Password must contain letters, numbers, and at least one special character (@, _, #, $, !)",
        "any.required": "Password is required",
      }),

    captcha: joi
      .string()
      .trim()
      .pattern(/^[0-9A-za-z]{5}$/)
      .required()
      .messages({
        "string.base": "CAPTCHA must be a string",
        "string.empty": "CAPTCHA is required",
        "string.pattern.base":
          "CAPTCHA must be exactly 5 alphanumeric characters",
        "any.required": "CAPTCHA is required",
      }),

    uuid: joi.string().uuid().required().messages({
      "string.base": "UUID must be a string",
      "string.empty": "UUID cannot be empty",
      "string.guid": "UUID must be a valid UUID",
      "any.required": "UUID is required",
    }),
  }),
};

const changePasswordValidation = {
  body: createBaseObjectSchema({
    oldPassword: joi
      .string()
      .trim()
      .min(8)
      .max(64)
      .pattern(passwordPattern)
      .required()
      .messages({
        "string.base": "Old password must be a string",
        "string.empty": "Old password is required",
        "string.min": "Old password must be at least 8 characters long",
        "string.max": "Old password must not exceed 64 characters",
        "string.pattern.base":
          "Old password must contain letters, numbers, and at least one special character (@, _, #, $, !)",
        "any.required": "Old password is required",
      }),

    newPassword: joi
      .string()
      .trim()
      .min(8)
      .max(64)
      .pattern(passwordPattern)
      .not(joi.ref("oldPassword"))
      .required()
      .messages({
        "string.base": "New password must be a string",
        "string.empty": "New password is required",
        "string.min": "New password must be at least 8 characters long",
        "string.max": "New password must not exceed 64 characters",
        "string.pattern.base":
          "New password must contain letters, numbers, and at least one special character (@, _, #, $, !)",
        "any.invalid": "New password must be different from the old password",
        "any.required": "New password is required",
      }),

    confirmPassword: joi
      .string()
      .equal(joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Confirm Password must match Password",
        "any.required": "Confirm Password is required",
      }),
  }),
};

const forgotPasswordValidation = {
  body: createBaseObjectSchema({
    email: joi
      .string()
      .email({ minDomainSegments: 2 })
      .lowercase()
      .required()
      .messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
      }),
  }),
};

const resetPasswordValidation = {
  params: createBaseObjectSchema({
    token: joi.string().uuid().required().messages({
      "string.guid": "Reset token is not a valid UUID.",
      "any.required": "Reset token is required.",
    }),
  }),

  body: createBaseObjectSchema({
    newPassword: joi
      .string()
      .trim()
      .min(8)
      .max(64)
      .pattern(passwordPattern)
      .required()
      .messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must not exceed 64 characters",
        "string.pattern.base":
          "Password must contain letters, numbers, and at least one special character (@, _, #, $, !)",
        "any.required": "Password is required",
      }),

    confirmPassword: joi
      .string()
      .equal(joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Confirm Password must match Password",
        "any.required": "Confirm Password is required",
      }),
  }),
};

const verifyEmailValidation = {
  params: createBaseObjectSchema({
    token: joi.string().uuid().required().messages({
      "string.guid": "Reset token is not a valid UUID.",
      "any.required": "Reset token is required.",
    }),
  }),
};

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation,
};
