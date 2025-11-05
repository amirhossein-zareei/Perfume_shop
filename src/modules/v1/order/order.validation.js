const joi = require("joi");

const {
  createListOptionsValidation,
} = require("../../../utils/validationHelpers");

const getOrdersValidation = createListOptionsValidation();

module.exports = {
    getOrdersValidation,
}
