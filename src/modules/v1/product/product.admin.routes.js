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
  updateProductValidation,
} = require("./product.validation");
const {
  createProduct,
  getAllProducts,
  getAdminProduct,
  updateProduct,
  activateProduct,
  deactivateProduct,
  addGalleryImages,
  deleteGalleryImages,
} = require("./product.controller");
const parseJsonFields = require("../../../middlewares/parseJsonFields");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

router
  .route("/")
  .post(
    uploadProductImage.single("coverImage"),
    parseJsonFields(["volumes", "categoryIds"]),
    validate(createProductValidation),
    createProduct
  )
  .get(validate(getProductsValidation), getAllProducts);

router
  .route("/:slug")
  .get(validate(slugValidation), getAdminProduct)
  .patch(
    uploadProductImage.single("coverImage"),
    parseJsonFields(["volumes", "categoryIds"]),
    validate(updateProductValidation),
    updateProduct
  );

router.patch("/:slug/activate", validate(slugValidation), activateProduct);
router.patch("/:slug/deactivate", validate(slugValidation), deactivateProduct);

router
  .route("/:slug/gallery")
  .post(
    validate(slugValidation),
    uploadProductImage.array("images", 5),
    addGalleryImages
  )
  .delete(validate(slugValidation), deleteGalleryImages);

module.exports = router;
