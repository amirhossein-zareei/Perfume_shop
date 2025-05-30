const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddlewares");
const { registerValidation, loginValidation } = require("./auth.validation");
const {getCaptcha, register, login } = require("./auth.controller");

const router = Router();

router.get("/captcha", getCaptcha);

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);

module.exports = router;
