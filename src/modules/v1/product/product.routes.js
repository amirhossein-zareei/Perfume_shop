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

router.get("/", validate(getProductsValidation), getPublicProducts);

router.get("/:slug", validate(slugValidation), getPublicProduct);

router.get(
  "/:slug/comments",
  validate(slugValidation),
  validate(getProductCommentsValidation),
  getProductComments
);

router.post(
  "/:slug/comment",
  auth,
  validate(slugValidation),
  validate(createProductCommentValidation),
  createProductComment
);

module.exports = router;
