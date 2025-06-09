const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation,
} = require("./auth.validation");
const {
  getCaptcha,
  register,
  login,
  logout,
  getMe,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  resendVerification,
  verifyEmail,
} = require("./auth.controller");

const router = Router();

router.get("/captcha", getCaptcha);

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/logout", auth, logout);
router.get("/me", auth, getMe);

router.post("/refresh-token", refreshToken);

router.patch(
  "/change-password",
  auth,
  validate(changePasswordValidation),
  changePassword
);
router.post(
  "/forgot-password",
  validate(forgotPasswordValidation),
  forgotPassword
);
router.post(
  "/reset-password/:token",
  validate(resetPasswordValidation),
  resetPassword
);

router.post("/resend-verification", auth, resendVerification);
router.post(
  "/verify-email/:token",
  validate(verifyEmailValidation),
  verifyEmail
);

module.exports = router;
