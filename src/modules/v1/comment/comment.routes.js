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

router.get("/", validate(getAdminCommentsValidation), getComments);

router.route("/:commentId")
  .patch(
    validateObjectIdMiddleware("commentId"),
    validate(changeCommentStatusValidation),
    changeCommentStatus
  )
  .delete(validateObjectIdMiddleware("commentId"), deleteComment);

module.exports = router;
