const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const { uploadBrandLogo } = require("../../../middlewares/uploadMiddleware");
const {
  createBrandValidation,
  slugValidation,
  updateBrandValidation,
  getBrandsValidation,
} = require("./brand.validation");
const {
  createBrand,
  getBrands,
  getBrand,
  deleteBrand,
  updateBrand,
} = require("./brand.controller");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

/**
 * @swagger
 * /api/v1/admin/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [⚙️🏷️ Admin - Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Guerlain'
 *               content:
 *                 type: string
 *                 example: 'Guerlain is a renowned French luxury brand...'
 *               website:
 *                 type: string
 *                 example: 'https://www.guerlain.com'
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: 'Brand logo image file'
 *             required: [name, content, website, logo]
 *     responses:
 *       '201':
 *         description: Brand created successfully
 *       '400':
 *         description: Validation error or logo not provided
 *       '401':
 *         description: Authentication required or not admin
 *       '409':
 *         description: Brand name already exists
 */
router.post(
  "/",
  uploadBrandLogo.single("logo"),
  validate(createBrandValidation),
  createBrand
);

/**
 * @swagger
 * /api/v1/admin/brands:
 *   get:
 *     summary: Get all brands (admin)
 *     tags: [⚙️🏷️ Admin - Brands]
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
 *         description: Brands retrieved successfully
 */
router.get("/", validate(getBrandsValidation), getBrands);

/**
 * @swagger
 * /api/v1/admin/brands/{slug}:
 *   get:
 *     summary: Get a specific brand
 *     tags: [⚙️🏷️ Admin - Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: 'guerlain'
 *     responses:
 *       '200':
 *         description: Brand retrieved successfully
 *       '404':
 *         description: Brand not found
 */
router.get("/:slug", validate(slugValidation), getBrand);

/**
 * @swagger
 * /api/v1/admin/brands/{slug}:
 *   delete:
 *     summary: Delete a brand
 *     tags: [⚙️🏷️ Admin - Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Brand deleted successfully
 *       '401':
 *         description: Authentication required or not admin
 *       '404':
 *         description: Brand not found
 */
router.delete("/:slug", validate(slugValidation), deleteBrand);

/**
 * @swagger
 * /api/v1/admin/brands/{slug}:
 *   patch:
 *     summary: Update a brand
 *     tags: [⚙️🏷️ Admin - Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Guerlain Updated'
 *               content:
 *                 type: string
 *               website:
 *                 type: string
 *                 example: 'https://www.guerlain.com'
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: New brand logo image (optional)
 *     responses:
 *       '200':
 *         description: Brand updated successfully
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Authentication required or not admin
 *       '404':
 *         description: Brand not found
 *       '409':
 *         description: Brand name already in use
 */
router.patch(
  "/:slug",
  uploadBrandLogo.single("logo"),
  validate(updateBrandValidation),
  updateBrand
);

module.exports = router;
