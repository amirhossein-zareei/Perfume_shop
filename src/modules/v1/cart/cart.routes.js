const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");
const {
  cartItemsValidation,
  quantityValidation,
} = require("./cart.validation");
const {
  getCart,
  deleteCartItems,
  addItemToCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  removeCartItem,
} = require("./cart.controller");

const router = Router();

router.use(auth);

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get user cart
 *     tags: [🛒 Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Cart retrieved successfully
 *       '401':
 *         description: Authentication required
 */
router.get("/", getCart);

/**
 * @swagger
 * /api/v1/cart:
 *   delete:
 *     summary: Clear cart
 *     tags: [🛒 Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Cart cleared successfully
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Cart not found
 */
router.delete("/", deleteCartItems);

/**
 * @swagger
 * /api/v1/cart/item:
 *   post:
 *     summary: Add item to cart
 *     tags: [🛒 Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: '507f1f77bcf86cd799439011'
 *               volumeId:
 *                 type: string
 *                 example: '507f1f77bcf86cd799439012'
 *               quantity:
 *                 type: integer
 *                 example: 1
 *             required: [productId, volumeId, quantity]
 *     responses:
 *       '200':
 *         description: Item added to cart successfully
 *       '400':
 *         description: Validation error or stock limit exceeded
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Product or volume not found or inactive
 */
router.post("/item", validate(cartItemsValidation), addItemToCart);

/**
 * @swagger
 * /api/v1/cart/item/{itemId}/increase:
 *   patch:
 *     summary: Increase item quantity
 *     tags: [🛒 Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               quantity:
 *                 type: integer
 *                 example: 1
 *             required: [quantity]
 *     responses:
 *       '200':
 *         description: Cart item quantity increased successfully
 *       '400':
 *         description: Quantity update exceeds allowed limits
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Item not found in cart
 *       '409':
 *         description: Invalid item ID format
 */
router.patch(
  "/item/:itemId/increase",
  validate(validateObjectIdMiddleware("itemId")),
  validate(quantityValidation),
  increaseCartItemQuantity
);

/**
 * @swagger
 * /api/v1/cart/item/{itemId}/decrease:
 *   patch:
 *     summary: Decrease item quantity
 *     tags: [🛒 Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               quantity:
 *                 type: integer
 *                 example: 1
 *             required: [quantity]
 *     responses:
 *       '200':
 *         description: Cart item quantity decreased successfully
 *       '400':
 *         description: Quantity update exceeds allowed limits
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Item not found in cart
 */
router.patch(
  "/item/:itemId/decrease",
  validate(validateObjectIdMiddleware("itemId")),
  validate(quantityValidation),
  decreaseCartItemQuantity
);

/**
 * @swagger
 * /api/v1/cart/item/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [🛒 Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Cart item removed successfully
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Item not found in cart
 *       '409':
 *         description: Invalid item ID format
 */
router.delete(
  "/item/:itemId",
  validate(validateObjectIdMiddleware("itemId")),
  removeCartItem
);

module.exports = router;
