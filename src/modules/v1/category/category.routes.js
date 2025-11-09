const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const {
  getCategoriesValidation,
  slugValidation,
} = require("./category.validation");
const { getCategories, getCategory } = require("./category.controller");

const router = Router();

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [📂 Categories]
 *     responses:
 *       '200':
 *         description: Categories retrieved successfully
 */
router.get("/", validate(getCategoriesValidation), getCategories);

/**
 * @swagger
 * /api/v1/categories/{slug}:
 *   get:
 *     summary: Get a specific category
 *     tags: [📂 Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: 'perfumes'
 *     responses:
 *       '200':
 *         description: Category retrieved successfully
 *       '404':
 *         description: Category not found
 */
router.get("/:slug", validate(slugValidation), getCategory);

module.exports = router;
