const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  updateCheckoutValidation,
  verifyPaymentValidation,
} = require("./checkout.validation");
const {
  createCheckout,
  getCheckout,
  updateCheckout,
  cancelCheckout,
  initiatePayment,
  handlePaymentCallback,
} = require("./checkout.controller");

const router = Router();

router.use(auth);

/**
 * @swagger
 * /api/v1/checkout:
 *   post:
 *     summary: Create checkout session
 *     tags: [💳 Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Checkout session created successfully
 *       '400':
 *         description: Cart is empty or no available products
 *       '401':
 *         description: Authentication required
 *       '409':
 *         description: No shipping address or active checkout session already exists
 */
router.post("/", createCheckout);

/**
 * @swagger
 * /api/v1/checkout:
 *   get:
 *     summary: Get current checkout session
 *     tags: [💳 Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Checkout session retrieved successfully
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Checkout not found
 */
router.get("/", getCheckout);

/**
 * @swagger
 * /api/v1/checkout:
 *   patch:
 *     summary: Update checkout session
 *     tags: [💳 Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *                 example: '507f1f77bcf86cd799439011'
 *               paymentMethod:
 *                 type: string
 *                 enum: ['paypal', 'stripe']
 *                 example: 'stripe'
 *     responses:
 *       '200':
 *         description: Checkout session updated successfully
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Checkout or address not found
 */
router.patch("/", validate(updateCheckoutValidation), updateCheckout);

/**
 * @swagger
 * /api/v1/checkout:
 *   delete:
 *     summary: Cancel checkout session
 *     tags: [💳 Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Checkout session deleted successfully
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Checkout not found
 */
router.delete("/", cancelCheckout);

/**
 * @swagger
 * /api/v1/checkout/payment:
 *   post:
 *     summary: Initiate payment
 *     tags: [💳 Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Payment link generated
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: No active checkout session found
 *       '409':
 *         description: Active payment link already exists
 */
router.post("/payment", initiatePayment);

/**
 * @swagger
 * /api/v1/checkout/callback:
 *   get:
 *     summary: Handle payment callback
 *     tags: [💳 Checkout]
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *           example: 'cs_test_1234567890'
 *     responses:
 *       '200':
 *         description: Payment verified and order created
 *       '400':
 *         description: Payment verification failed
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Checkout not found
 *       '409':
 *         description: Checkout was cancelled or insufficient stock
 */
router.get(
  "/callback",
  validate(verifyPaymentValidation),
  handlePaymentCallback
);

module.exports = router;
