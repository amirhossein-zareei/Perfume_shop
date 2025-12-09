const express = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { sendContactEmail } = require("./contact.controller");
const { contactValidation } = require("./contact.validation");

const router = express.Router();

router.post("/", validate(contactValidation), sendContactEmail);

module.exports = router;
