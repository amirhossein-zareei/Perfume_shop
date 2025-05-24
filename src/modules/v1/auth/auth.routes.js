const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddlewares");
const { registerValidation } = require("./auth.validation");
const { register } = require("./auth.controller");

const router = Router();

router.post("/register", validate(registerValidation), register);

module.exports = router;
