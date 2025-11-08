const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const { uploadBrandLogo } = require("../../../middlewares/uploadMiddleware");
const {
  createBrandValidation,
  slugValidation,
  updateBrandValidation,
} = require("./brand.validation");
const {
  createBrand,
  deleteBrand,
  updateBrand,
} = require("./brand.controller");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

router.post(
  "/",
  uploadBrandLogo.single("logo"),
  validate(createBrandValidation),
  createBrand
);

router
  .route("/:slug")
  .delete(validate(slugValidation), deleteBrand)
  .patch(
    uploadBrandLogo.single("logo"),
    validate(updateBrandValidation),
    updateBrand
  );

module.exports = router;
