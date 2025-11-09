const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const {
  getOrdersValidation,
  orderNumberValidation,
  changeOrderStatusValidation,
} = require("./order.validation");
const {
  getOrdersForAdmin,
  getOrderForAdmin,
  changeOrderStatus,
} = require("./order.controller");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

/**
 * @swagger
 * /api/v1/admin/orders:
 *   get:
 *     summary: Get all orders (Admin)
 *     tags: [⚙️📦 Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Orders retrieved successfully
 *       '401':
 *         description: Authentication required or not admin
 */
router.get("/", validate(getOrdersValidation), getOrdersForAdmin);

/**
 * @swagger
 * /api/v1/admin/orders/{orderNumber}:
 *   get:
 *     summary: Get a specific order (Admin)
 *     tags: [⚙️📦 Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Order retrieved successfully
 *       '401':
 *         description: Authentication required or not admin
 *       '404':
 *         description: Order not found
 */
router.get("/:orderNumber", validate(orderNumberValidation), getOrderForAdmin);

/**
 * @swagger
 * /api/v1/admin/orders/{orderNumber}/status:
 *   patch:
 *     summary: Change order status
 *     tags: [⚙️📦 Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected, shipped, delivered, cancelled]
 *                 example: 'shipped'
 *               note:
 *                 type: string
 *                 example: 'Order has been packed'
 *             required: [status]
 *     responses:
 *       '200':
 *         description: Order status updated
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Authentication required or not admin
 *       '404':
 *         description: Order not found or has been cancelled
 */
router.patch(
  "/:orderNumber/status",
  validate(orderNumberValidation),
  validate(changeOrderStatusValidation),
  changeOrderStatus
);

module.exports = router;
