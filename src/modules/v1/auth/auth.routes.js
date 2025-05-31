const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const { registerValidation, loginValidation } = require("./auth.validation");
const {
  getCaptcha,
  register,
  login,
  logout,
  getMe,
} = require("./auth.controller");

const router = Router();

router.get("/captcha", getCaptcha);

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/logout", auth, logout);
router.get("/me", auth, getMe);

module.exports = router;
