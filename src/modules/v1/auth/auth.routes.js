const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  createRateLimiter,
} = require("../../../middlewares/rateLimiterMiddleware");
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
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  resendVerification,
  verifyEmail,
} = require("./auth.controller");

const router = Router();

/**
 * @swagger
 * /api/v1/auth/captcha:
 *   get:
 *     summary: Generate CAPTCHA
 *     tags: [🔐 Auth]
 *     responses:
 *       '200':
 *         description: CAPTCHA generated successfully
 *       '429':
 *         description: Too many requests, please try again later
 */
router.get("/captcha", createRateLimiter(10, 10), getCaptcha);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [🔐 Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'John Doe'
 *               email:
 *                 type: string
 *                 example: 'john@example.com'
 *               password:
 *                 type: string
 *                 example: 'Password@123'
 *               confirmPassword:
 *                 type: string
 *                 example: 'Password@123'
 *               captcha:
 *                 type: string
 *                 example: 'a1b2c'
 *               captchaId:
 *                 type: string
 *                 example: '550e8400-e29b-41d4-a716-446655440000'
 *             required: [name, email, password, confirmPassword, captcha, captchaId]
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Validation error or invalid CAPTCHA
 *       '409':
 *         description: Email already registered
 *       '429':
 *         description: Too many requests, please try again later
 */
router.post(
  "/register",
  createRateLimiter(5, 5),
  validate(registerValidation),
  register
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [🔐 Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'john@example.com'
 *               password:
 *                 type: string
 *                 example: 'Password@123'
 *               captcha:
 *                 type: string
 *                 example: 'a1b2c'
 *               captchaId:
 *                 type: string
 *                 example: '550e8400-e29b-41d4-a716-446655440000'
 *             required: [email, password, captcha, captchaId]
 *     responses:
 *       '200':
 *         description: Login successful
 *       '401':
 *         description: Invalid email or password
 *       '403':
 *         description: Account banned or deactivated
 *       '429':
 *         description: Too many requests, please try again later
 */
router.post(
  "/login",
  createRateLimiter(5, 5),
  validate(loginValidation),
  login
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [🔐 Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully logged out
 *       '401':
 *         description: Authentication required
 */
router.post("/logout", auth, logout);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [🔐 Auth]
 *     responses:
 *       '200':
 *         description: Tokens refreshed successfully
 *       '401':
 *         description: Invalid or expired refresh token
 *       '403':
 *         description: User account issues
 *       '429':
 *         description: Too many requests, please try again later
 */
router.post("/refresh-token", createRateLimiter(15, 10), refreshToken);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [🔐 Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: 'OldPassword@123'
 *               newPassword:
 *                 type: string
 *                 example: 'NewPassword@456'
 *               confirmPassword:
 *                 type: string
 *                 example: 'NewPassword@456'
 *             required: [oldPassword, newPassword, confirmPassword]
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *       '400':
 *         description: Old password is incorrect
 *       '401':
 *         description: Authentication required
 *       '429':
 *         description: Too many requests, please try again later
 */
router.patch(
  "/change-password",
  createRateLimiter(15, 5),
  auth,
  validate(changePasswordValidation),
  changePassword
);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [🔐 Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'john@example.com'
 *             required: [email]
 *     responses:
 *       '200':
 *         description: Reset link sent (if account exists)
 *       '429':
 *         description: Too many requests, please try again later
 */
router.post(
  "/forgot-password",
  createRateLimiter(15, 5),
  validate(forgotPasswordValidation),
  forgotPassword
);

/**
 * @swagger
 * /api/v1/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password with token
 *     tags: [🔐 Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           example: '550e8400-e29b-41d4-a716-446655440000'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: 'NewPassword@456'
 *               confirmPassword:
 *                 type: string
 *                 example: 'NewPassword@456'
 *             required: [newPassword, confirmPassword]
 *     responses:
 *       '200':
 *         description: Password has been reset successfully
 *       '400':
 *         description: Invalid or expired reset token
 *       '429':
 *         description: Too many requests, please try again later
 */
router.post(
  "/reset-password/:token",
  createRateLimiter(15, 5),
  validate(resetPasswordValidation),
  resetPassword
);

/**
 * @swagger
 * /api/v1/auth/resend-verification:
 *   post:
 *     summary: Resend email verification
 *     tags: [🔐 Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Verification link sent to email
 *       '400':
 *         description: Email already verified
 *       '401':
 *         description: Authentication required
 *       '429':
 *         description: Too many requests, please try again later
 */
router.post(
  "/resend-verification",
  createRateLimiter(15, 5),
  auth,
  resendVerification
);

/**
 * @swagger
 * /api/v1/auth/verify-email/{token}:
 *   post:
 *     summary: Verify email address
 *     tags: [🔐 Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Your email has been verified successfully
 *       '400':
 *         description: Invalid or expired verification token
 *       '403':
 *         description: Account banned or deactivated
 *       '429':
 *         description: Too many requests, please try again later
 */
router.post(
  "/verify-email/:token",
  createRateLimiter(15, 5),
  validate(verifyEmailValidation),
  verifyEmail
);

module.exports = router;
