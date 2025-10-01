const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const { uploadProductImage } = require("../../../middlewares/uploadMiddleware");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");
const {
  crateProductValidation,
  getProductsValidation,
  getProductValidation,
} = require("./product.validation");
const {
  crateProduct,
  getAllProducts,
  getAdminProduct,
} = require("./product.controller");
const parseJsonFields = require("../../../middlewares/parseJsonFields");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

router
  .route("/")
  .post(
    uploadProductImage.single("coverImage"),
    parseJsonFields(["volumes"]),
    validate(crateProductValidation),
    crateProduct
  )
  .get(validate(getProductsValidation), getAllProducts);

router.route("/:slug").get(validate(getProductValidation), getAdminProduct);

module.exports = router;
