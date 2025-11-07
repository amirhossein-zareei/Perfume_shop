const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { getProductsValidation, slugValidation } = require("./product.validation");
const {
  getPublicProducts,
  getPublicProduct,
} = require("./product.controller");

const router = Router();

router.get("/", validate(getProductsValidation), getPublicProducts);

router.get(
  "/:slug",
  validate(slugValidation),
  getPublicProduct
);

// router.get("/:slug/comments")
// router.post("/:slug/comment")

module.exports = router;
