const { Router } = require("express");
const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");
const {
  getAdminCommentsValidation,
  changeCommentStatusValidation,
} = require("./comment.validation");
const {
  getComments,
  changeCommentStatus,
  deleteComment,
} = require("./comment.controller");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

/**
 * @swagger
 * /api/v1/admin/comments:
 *   get:
 *     summary: Get all comments
 *     tags: [⚙️💬 Admin - Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by comment status
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
 *         description: Comments retrieved successfully
 *       '401':
 *         description: Authentication required or not admin
 */
router.get("/", validate(getAdminCommentsValidation), getComments);

/**
 * @swagger
 * /api/v1/admin/comments/{commentId}:
 *   patch:
 *     summary: Update comment status
 *     tags: [⚙️💬 Admin - Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           example: '507f1f77bcf86cd799439011'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 example: 'approved'
 *               replyContent:
 *                 type: string
 *                 example: 'Thank you for your feedback!'
 *             required: [status]
 *     responses:
 *       '200':
 *         description: Comment updated successfully
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Authentication required or not admin
 *       '404':
 *         description: Comment not found
 *       '409':
 *         description: Invalid comment ID format
 */
router.patch(
  "/:commentId",
  validateObjectIdMiddleware("commentId"),
  validate(changeCommentStatusValidation),
  changeCommentStatus
);

/**
 * @swagger
 * /api/v1/admin/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [⚙️💬 Admin - Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Comment deleted successfully
 *       '401':
 *         description: Authentication required or not admin
 *       '404':
 *         description: Comment not found
 *       '409':
 *         description: Invalid comment ID format
 */
router.delete(
  "/:commentId",
  validateObjectIdMiddleware("commentId"),
  deleteComment
);

module.exports = router;
