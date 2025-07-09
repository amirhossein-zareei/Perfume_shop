const joi = require("joi");

const createBodyObjectSchema = (fields) => {
  return joi.object(fields).required().unknown(false).messages({
    "object.base": "Request body must be an object",
    "any.required": "Request body is required",
  });
};

const createParamsObjectSchema = (fields) => {
  return joi.object(fields).unknown(false).messages({
    "object.base": "Request params must be an object",
  });
};

const updateMeValidation = {
  body: createBodyObjectSchema({
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
  }),
};

const createAddressValidation = {
  body: createBodyObjectSchema({
    phone: joi
      .string()
      .trim()
      .pattern(/^\+?[1-9]\d{6,14}$/)
      .required()
      .messages({
        "string.pattern.base": "Please enter a valid phone number format.",
        "string.empty": "Phone number cannot be empty.",
        "any.required": "Phone number is required.",
      }),

    stateId: joi.number().integer().min(100).max(9999).required().messages({
      "number.base": "Province ID must be a number.",
      "number.integer": "Province ID must be an integer.",
      "number.min": "Province ID is not valid.",
      "number.max": "Province ID is not valid.",
      "any.required": "Selecting a province is required.",
    }),

    cityId: joi.string().hex().length(24).required().messages({
      "string.hex": "City ID format is not valid.",
      "string.length": "City ID format is not valid.",
      "any.required": "Selecting a city is required.",
    }),

    addressLine: joi.string().trim().min(5).max(255).required().messages({
      "string.min": "Address line must be at least 5 characters.",
      "string.max": "Address line must not exceed 255 characters.",
      "string.empty": "Address line cannot be empty.",
      "any.required": "Address line is required.",
    }),

    postalCode: joi
      .string()
      .trim()
      .uppercase()
      .pattern(/^[a-zA-Z0-9\s-]{3,10}$/)
      .required()
      .messages({
        "string.pattern.base": "Please enter a valid postal code.",
        "string.empty": "Postal code cannot be empty.",
        "any.required": "Postal code is required.",
      }),

    latitude: joi.number().min(-90).max(90).optional().messages({
      "number.min": "Latitude must be at least -90",
      "number.max": "Latitude must be at most 90",
    }),

    longitude: joi.number().min(-180).max(180).optional().messages({
      "number.min": "Longitude must be at least -180",
      "number.max": "Longitude must be at most 180",
    }),
  }),
};

const updateAddressValidation = {
  params: createParamsObjectSchema({
    addressId: joi.string().hex().length(24).required().messages({
      "any.required": "Address ID is required in the URL.",
      "string.hex": "The format of the Address ID is invalid.",
      "string.length": "The format of the Address ID is invalid.",
    }),
  }),

  body: createBodyObjectSchema({
    phone: joi
      .string()
      .trim()
      .pattern(/^\+?[1-9]\d{6,14}$/)
      .messages({
        "string.pattern.base": "Please enter a valid phone number format.",
      }),

    stateId: joi.number().integer().min(100).max(9999).messages({
      "number.base": "Province ID must be a number.",
      "number.integer": "Province ID must be an integer.",
      "number.min": "Province ID is not valid.",
      "number.max": "Province ID is not valid.",
    }),

    cityId: joi.string().hex().length(24).messages({
      "string.hex": "City ID format is not valid.",
      "string.length": "City ID format is not valid.",
    }),

    addressLine: joi.string().trim().min(5).max(255).messages({
      "string.min": "Address line must be at least 5 characters.",
      "string.max": "Address line must not exceed 255 characters.",
    }),

    postalCode: joi
      .string()
      .trim()
      .uppercase()
      .pattern(/^[a-zA-Z0-9\s-]{3,10}$/)
      .messages({
        "string.pattern.base": "Please enter a valid postal code.",
      }),

    latitude: joi.number().min(-90).max(90).optional().messages({
      "number.min": "Latitude must be at least -90",
      "number.max": "Latitude must be at most 90",
    }),

    longitude: joi.number().min(-180).max(180).optional().messages({
      "number.min": "Longitude must be at least -180",
      "number.max": "Longitude must be at most 180",
    }),
  }),
};

const deleteAddressValidation = {
  params: createParamsObjectSchema({
    addressId: joi.string().hex().length(24).required().messages({
      "any.required": "Address ID is required in the URL.",
      "string.hex": "The format of the Address ID is invalid.",
      "string.length": "The format of the Address ID is invalid.",
    }),
  }),
};

const getUserValidation = {
  params: createParamsObjectSchema({
    userId: joi.string().hex().length(24).required().messages({
      "any.required": "Address ID is required in the URL.",
      "string.hex": "The format of the Address ID is invalid.",
      "string.length": "The format of the Address ID is invalid.",
    }),
  }),
};

const changeRoleValidation = {
  params: createParamsObjectSchema({
    userId: joi.string().hex().length(24).required().messages({
      "any.required": "User ID is required in the URL.",
      "string.hex": "The format of the User ID is invalid.",
      "string.length": "The format of the User ID is invalid.",
    }),
  }),

  body: createBodyObjectSchema({
    role: joi.string().trim().valid("ADMIN", "USER").required().messages({
      "string.base": "Role must be a string.",
      "string.empty": "Role is required.",
      "any.only": "Role must be either 'ADMIN' or 'USER'.",
      "any.required": "Role is required.",
    }),
  }),
};

const banUserValidation = {
  params: createParamsObjectSchema({
    userId: joi.string().hex().length(24).required().messages({
      "any.required": "User ID is required in the URL.",
      "string.hex": "The format of the User ID is invalid.",
      "string.length": "The format of the User ID is invalid.",
    }),
  }),
};

const unbanUserValidation = {
  params: createParamsObjectSchema({
    userId: joi.string().hex().length(24).required().messages({
      "any.required": "User ID is required in the URL.",
      "string.hex": "The format of the User ID is invalid.",
      "string.length": "The format of the User ID is invalid.",
    }),
  }),
};

const reactivateUserValidation = {
  params: createParamsObjectSchema({
    userId: joi.string().hex().length(24).required().messages({
      "any.required": "User ID is required in the URL.",
      "string.hex": "The format of the User ID is invalid.",
      "string.length": "The format of the User ID is invalid.",
    }),
  }),
};

module.exports = {
  updateMeValidation,
  createAddressValidation,
  updateAddressValidation,
  deleteAddressValidation,
  getUserValidation,
  changeRoleValidation,
  banUserValidation,
  unbanUserValidation,
  reactivateUserValidation,
};
