const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddlewares");
const { registerValidation } = require("./auth.validation");
const { getCaptcha, register } = require("./auth.controller");

const router = Router();

router.get("/captcha", getCaptcha);

router.post("/register", validate(registerValidation), register);

module.exports = router;
