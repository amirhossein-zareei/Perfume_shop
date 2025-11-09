const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  getOrdersValidation,
  orderNumberValidation,
} = require("./order.validation");
const { getOrders, getOrder, cancelOrder } = require("./order.controller");

const router = Router();

router.use(auth);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get user orders
 *     tags: [📦 Orders]
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
 *         description: Authentication required
 */
router.get("/", validate(getOrdersValidation), getOrders);

/**
 * @swagger
 * /api/v1/orders/{orderNumber}:
 *   get:
 *     summary: Get a specific order
 *     tags: [📦 Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *           example: 'ORD-1731058800000-1'
 *     responses:
 *       '200':
 *         description: Order retrieved successfully
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Order not found
 */
router.get("/:orderNumber", validate(orderNumberValidation), getOrder);

/**
 * @swagger
 * /api/v1/orders/{orderNumber}/cancel:
 *   post:
 *     summary: Cancel an order
 *     tags: [📦 Orders]
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
 *         description: Order cancelled successfully
 *       '400':
 *         description: Order already cancelled or not in pending status
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Order not found
 */
router.post(
  "/:orderNumber/cancel",
  validate(orderNumberValidation),
  cancelOrder
);

module.exports = router;
