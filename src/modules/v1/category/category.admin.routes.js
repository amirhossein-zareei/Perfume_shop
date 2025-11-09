const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const { uploadIcon } = require("../../../middlewares/uploadMiddleware");
const {
  createCategoryValidation,
  getCategoriesValidation,
  slugValidation,
  updatedCategoryValidation,
} = require("./category.validation");
const {
  createCategory,
  getAllCategoriesForAdmin,
  deleteCategory,
  updatedCategory,
  reactivateCategory,
} = require("./category.controller");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

/**
 * @swagger
 * /api/v1/admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [⚙️📂 Admin - Categories]
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
 *                 example: 'Perfumes'
 *               parentId:
 *                 type: string
 *                 example: '507f1f77bcf86cd799439011'
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Category created successfully
 *       '400':
 *         description: Validation error or parent category not found
 *       '401':
 *         description: Authentication required or not admin
 *       '409':
 *         description: Category name already exists
 */
router.post(
  "/",
  uploadIcon.single("icon"),
  validate(createCategoryValidation),
  createCategory
);

/**
 * @swagger
 * /api/v1/admin/categories:
 *   get:
 *     summary: Get all categories (Admin)
 *     tags: [⚙️📂 Admin - Categories]
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
 *         description: Categories retrieved successfully
 *       '401':
 *         description: Authentication required or not admin
 */
router.get("/", validate(getCategoriesValidation), getAllCategoriesForAdmin);

/**
 * @swagger
 * /api/v1/admin/categories/{slug}:
 *   delete:
 *     summary: Deactivate a category
 *     tags: [⚙️📂 Admin - Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Category deactivated successfully
 *       '400':
 *         description: Category already deactivated
 *       '401':
 *         description: Authentication required or not admin
 *       '404':
 *         description: Category not found
 */
router.delete("/:slug", validate(slugValidation), deleteCategory);

/**
 * @swagger
 * /api/v1/admin/categories/{slug}:
 *   patch:
 *     summary: Update a category
 *     tags: [⚙️📂 Admin - Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Premium Perfumes'
 *               parentId:
 *                 type: string
 *                 example: '507f1f77bcf86cd799439011'
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Authentication required or not admin
 *       '404':
 *         description: Category not found
 *       '409':
 *         description: Category name already in use
 */
router.patch(
  "/:slug",
  uploadIcon.single("icon"),
  validate(updatedCategoryValidation),
  updatedCategory
);

/**
 * @swagger
 * /api/v1/admin/categories/{slug}/reactivate:
 *   patch:
 *     summary: Reactivate a category
 *     tags: [⚙️📂 Admin - Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Category reactivated successfully
 *       '400':
 *         description: Category already active
 *       '401':
 *         description: Authentication required or not admin
 *       '404':
 *         description: Category not found
 */
router.patch("/:slug/reactivate", validate(slugValidation), reactivateCategory);

module.exports = router;
