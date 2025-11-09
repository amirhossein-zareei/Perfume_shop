const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { getBrandsValidation, slugValidation } = require("./brand.validation");
const { getBrands, getBrand } = require("./brand.controller");

const router = Router();

/**
 * @swagger
 * /api/v1/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [🏷️ Brands]
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
 * /api/v1/brands/{slug}:
 *   get:
 *     summary: Get a specific brand
 *     tags: [🏷️ Brands]
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

module.exports = router;
