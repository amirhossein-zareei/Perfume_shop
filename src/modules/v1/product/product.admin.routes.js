const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const { uploadProductImage } = require("../../../middlewares/uploadMiddleware");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");
const {
  createProductValidation,
  getProductsValidation,
  slugValidation,
} = require("./product.validation");
const {
  createProduct,
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
    validate(createProductValidation),
    createProduct
  )
  .get(validate(getProductsValidation), getAllProducts);

router.route("/:slug").get(validate(slugValidation), getAdminProduct);

module.exports = router;
