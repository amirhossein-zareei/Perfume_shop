const { Router } = require("express");
const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  getProductsValidation,
  slugValidation,
  getProductCommentsValidation,
  createProductCommentValidation,
} = require("./product.validation");
const {
  getPublicProducts,
  getPublicProduct,
  getProductComments,
  createProductComment,
} = require("./product.controller");

const router = Router();

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all public products
 *     tags: [🛍️ Products]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *       - { in: query, name: sort, schema: { type: string, enum: [newest, oldest, cheapest, mostExpensive] } }
 *     responses:
 *       '200': { description: 'Products retrieved successfully' }
 */
router.get("/", validate(getProductsValidation), getPublicProducts);

/**
 * @swagger
 * /api/v1/products/{slug}:
 *   get:
 *     summary: Get a specific product
 *     tags: [🛍️ Products]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string }, example: 'dior-sauvage' }
 *     responses:
 *       '200': { description: 'Product retrieved successfully' }
 *       '404': { description: 'Product not found' }
 */
router.get("/:slug", validate(slugValidation), getPublicProduct);

/**
 * @swagger
 * /api/v1/products/{slug}/comments:
 *   get:
 *     summary: Get product comments
 *     tags: [🛍️ Products]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *     responses:
 *       '200': { description: 'Comments retrieved successfully' }
 *       '404': { description: 'Product not found' }
 */
router.get(
  "/:slug/comments",
  validate(slugValidation),
  validate(getProductCommentsValidation),
  getProductComments
);

/**
 * @swagger
 * /api/v1/products/{slug}/comment:
 *   post:
 *     summary: Create a product comment
 *     tags: [🛍️ Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string, example: 'Great product!' }
 *               rating: { type: integer, example: 5, minimum: 1, maximum: 5 }
 *             required: [content, rating]
 *     responses:
 *       '201': { description: 'Comment submitted successfully' }
 *       '400': { description: 'Validation error or already commented' }
 *       '401': { description: 'Authentication required' }
 *       '404': { description: 'Product not found' }
 */
router.post(
  "/:slug/comment",
  auth,
  validate(slugValidation),
  validate(createProductCommentValidation),
  createProductComment
);

module.exports = router;
