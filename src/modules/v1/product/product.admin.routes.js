const { Router } = require("express");
const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const { uploadProductImage } = require("../../../middlewares/uploadMiddleware");
const {
  createProductValidation,
  getProductsValidation,
  slugValidation,
  updateProductValidation,
} = require("./product.validation");
const {
  createProduct,
  getAllProducts,
  getAdminProduct,
  updateProduct,
  activateProduct,
  deactivateProduct,
  addGalleryImages,
  deleteGalleryImages,
} = require("./product.controller");
const parseJsonFields = require("../../../middlewares/parseJsonFields");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

/**
 * @swagger
 * /api/v1/admin/products:
 *   post:
 *     summary: Create a new product
 *     tags: [⚙️🛍️ Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: 'Dior Sauvage' }
 *               description: { type: string, example: 'A fresh, spicy perfume...' }
 *               brandId: { type: string, example: '507f1f77bcf86cd799439011' }
 *               categoryIds: { type: array, items: { type: string }, example: ['507f1f77bcf86cd799439012'] }
 *               volumes: { type: string, example: '[{"type":"bottle","size":100,"price":89.99,"stock":50}]' }
 *               discount: { type: integer, example: 10 }
 *               coverImage: { type: string, format: binary }
 *     responses:
 *       '201': { description: 'Product created successfully' }
 *       '400': { description: 'Validation error or cover image not provided' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'Brand or category not found' }
 *       '409': { description: 'Product name already exists' }
 */
router.post(
  "/",
  uploadProductImage.single("coverImage"),
  parseJsonFields(["volumes", "categoryIds"]),
  validate(createProductValidation),
  createProduct
);

/**
 * @swagger
 * /api/v1/admin/products:
 *   get:
 *     summary: Get all products (Admin)
 *     tags: [⚙️🛍️ Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *       - { in: query, name: sort, schema: { type: string } }
 *     responses:
 *       '200': { description: 'Products retrieved successfully' }
 *       '401': { description: 'Authentication required or not admin' }
 */
router.get("/", validate(getProductsValidation), getAllProducts);

/**
 * @swagger
 * /api/v1/admin/products/{slug}:
 *   get:
 *     summary: Get a specific product (Admin)
 *     tags: [⚙️🛍️ Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     responses:
 *       '200': { description: 'Product retrieved successfully' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'Product not found' }
 */
router.get("/:slug", validate(slugValidation), getAdminProduct);

/**
 * @swagger
 * /api/v1/admin/products/{slug}:
 *   patch:
 *     summary: Update a product
 *     tags: [⚙️🛍️ Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               brandId: { type: string }
 *               categoryIds: { type: array, items: { type: string } }
 *               volumes: { type: string }
 *               discount: { type: integer }
 *               coverImage: { type: string, format: binary }
 *     responses:
 *       '200': { description: 'Product updated successfully' }
 *       '400': { description: 'Validation error' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'Product or related entity not found' }
 *       '409': { description: 'Product name already in use' }
 */
router.patch(
  "/:slug",
  uploadProductImage.single("coverImage"),
  parseJsonFields(["volumes", "categoryIds"]),
  validate(updateProductValidation),
  updateProduct
);

/**
 * @swagger
 * /api/v1/admin/products/{slug}/activate:
 *   patch:
 *     summary: Activate a product
 *     tags: [⚙️🛍️ Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     responses:
 *       '200': { description: 'Product activated successfully' }
 *       '400': { description: 'Product already active' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'Product not found' }
 */
router.patch("/:slug/activate", validate(slugValidation), activateProduct);

/**
 * @swagger
 * /api/v1/admin/products/{slug}/deactivate:
 *   patch:
 *     summary: Deactivate a product
 *     tags: [⚙️🛍️ Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     responses:
 *       '200': { description: 'Product deactivated successfully' }
 *       '400': { description: 'Product already inactive' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'Product not found' }
 */
router.patch("/:slug/deactivate", validate(slugValidation), deactivateProduct);

/**
 * @swagger
 * /api/v1/admin/products/{slug}/gallery:
 *   post:
 *     summary: Add gallery images to product
 *     tags: [⚙️🛍️ Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       '200': { description: 'Gallery updated successfully' }
 *       '400': { description: 'No images provided' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'Product not found' }
 */
router.post(
  "/:slug/gallery",
  validate(slugValidation),
  uploadProductImage.array("images", 5),
  addGalleryImages
);

/**
 * @swagger
 * /api/v1/admin/products/{slug}/gallery:
 *   delete:
 *     summary: Delete product gallery
 *     tags: [⚙️🛍️ Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     responses:
 *       '200': { description: 'Gallery deleted successfully' }
 *       '400': { description: 'Gallery is already empty' }
 *       '401': { description: 'Authentication required or not admin' }
 *       '404': { description: 'Product not found' }
 */
router.delete("/:slug/gallery", validate(slugValidation), deleteGalleryImages);

module.exports = router;
