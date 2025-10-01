const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { getProductsValidation, getProductValidation } = require("./product.validation");
const {
  getPublicProducts,
  getPublicProduct,
} = require("./product.controller");

const router = Router();

router.get("/", validate(getProductsValidation, getProductValidation), getPublicProducts);

router.get(
  "/:slug",
  validate(getProductValidation),
  getPublicProduct
);

module.exports = router;
