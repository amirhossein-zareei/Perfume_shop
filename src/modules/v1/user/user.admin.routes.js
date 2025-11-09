const { Router } = require("express");
const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");
const {
  changeRoleValidation,
  getUsersValidation,
} = require("./user.validation");
const {
  getUserAddresses,
  getUsers,
  getUser,
  changeRole,
  banUser,
  unbanUser,
  reactivateUser,
} = require("./user.controller");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

/**
 * @swagger
 * /api/v1/admin/users/{userId}/addresses:
 *   get:
 *     summary: Get user addresses
 *     tags: [⚙️👥 Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: userId, required: true, schema: { type: string } }
 *     responses:
 *       '200': { description: 'User addresses retrieved successfully' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'User not found' }
 *       '409': { description: 'Invalid user ID format' }
 */
router.get(
  "/:userId/addresses",
  validateObjectIdMiddleware("userId"),
  getUserAddresses
);

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [⚙️👥 Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *       - { in: query, name: sort, schema: { type: string } }
 *     responses:
 *       '200': { description: 'Users retrieved successfully' }
 *       '401': { description: 'Authentication required or not admin' }
 */
router.get("/", validate(getUsersValidation), getUsers);

/**
 * @swagger
 * /api/v1/admin/users/{userId}:
 *   get:
 *     summary: Get a specific user
 *     tags: [⚙️👥 Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: userId, required: true, schema: { type: string } }
 *     responses:
 *       '200': { description: 'User retrieved successfully' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'User not found' }
 *       '409': { description: 'Invalid user ID format' }
 */
router.get("/:userId", validateObjectIdMiddleware("userId"), getUser);

/**
 * @swagger
 * /api/v1/admin/users/{userId}/role:
 *   patch:
 *     summary: Change user role
 *     tags: [⚙️👥 Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: userId, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string, enum: [ADMIN, USER], example: 'ADMIN' }
 *             required: [role]
 *     responses:
 *       '200': { description: 'User role updated successfully' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'User not found' }
 *       '409': { description: 'Invalid user ID format' }
 */
router.patch(
  "/:userId/role",
  validateObjectIdMiddleware("userId"),
  validate(changeRoleValidation),
  changeRole
);

/**
 * @swagger
 * /api/v1/admin/users/{userId}/ban:
 *   patch:
 *     summary: Ban a user
 *     tags: [⚙️👥 Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: userId, required: true, schema: { type: string } }
 *     responses:
 *       '200': { description: 'User banned successfully' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'User not found' }
 *       '409': { description: 'Invalid user ID format' }
 */
router.patch("/:userId/ban", validateObjectIdMiddleware("userId"), banUser);

/**
 * @swagger
 * /api/v1/admin/users/{userId}/unban:
 *   patch:
 *     summary: Unban a user
 *     tags: [⚙️👥 Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: userId, required: true, schema: { type: string } }
 *     responses:
 *       '200': { description: 'User unbanned successfully' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'User not found' }
 *       '409': { description: 'Invalid user ID format' }
 */
router.patch("/:userId/unban", validateObjectIdMiddleware("userId"), unbanUser);

/**
 * @swagger
 * /api/v1/admin/users/{userId}/reactivate:
 *   patch:
 *     summary: Reactivate a user
 *     tags: [⚙️👥 Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: userId, required: true, schema: { type: string } }
 *     responses:
 *       '200': { description: 'User reactivated successfully' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'User not found' }
 *       '409': { description: 'Invalid user ID format' }
 */
router.patch(
  "/:userId/reactivate",
  validateObjectIdMiddleware("userId"),
  reactivateUser
);

module.exports = router;
