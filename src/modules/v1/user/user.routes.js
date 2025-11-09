const { Router } = require("express");
const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const { uploadAvatar } = require("../../../middlewares/uploadMiddleware");
const { updateMeValidation } = require("./user.validation");
const {
  getMe,
  deleteMe,
  updateMe,
  uploadProfileImage,
} = require("./user.controller");

const router = Router();

router.use(auth);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get user profile
 *     tags: [👤 Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200': { description: 'User profile retrieved successfully' }
 *       '401': { description: 'Authentication required' }
 */
router.get("/me", getMe);

/**
 * @swagger
 * /api/v1/users/me:
 *   delete:
 *     summary: Delete user account
 *     tags: [👤 Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200': { description: 'Account deactivated and logged out' }
 *       '401': { description: 'Authentication required' }
 */
router.delete("/me", deleteMe);

/**
 * @swagger
 * /api/v1/users/me:
 *   patch:
 *     summary: Update user profile
 *     tags: [👤 Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: 'John Doe' }
 *             required: [name]
 *     responses:
 *       '200': { description: 'User information updated successfully' }
 *       '400': { description: 'Validation error' }
 *       '401': { description: 'Authentication required' }
 */
router.patch("/me", validate(updateMeValidation), updateMe);

/**
 * @swagger
 * /api/v1/users/me/avatar:
 *   post:
 *     summary: Upload profile image
 *     tags: [👤 Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage: { type: string, format: binary }
 *     responses:
 *       '200': { description: 'Profile image uploaded successfully' }
 *       '400': { description: 'No image provided' }
 *       '401': { description: 'Authentication required' }
 */
router.post(
  "/me/avatar",
  uploadAvatar.single("profileImage"),
  uploadProfileImage
);

module.exports = router;
