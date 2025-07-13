const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const { uploadPublicFile } = require("../../../middlewares/uploadMiddleware");
const {
  createBrandValidation,
  getBrandsValidation,
  slugValidation,
  updateBrandValidation,
} = require("./brand.validation");
const {
  createBrand,
  getBrands,
  getBrand,
  deleteBrand,
  updateBrand,
} = require("./brand.controller");

const router = Router();

router
  .route("/")
  .post(
    auth,
    roleGuardMiddleware("ADMIN"),
    uploadPublicFile.single("logo"),
    validate(createBrandValidation),
    createBrand
  )
  .get(validate(getBrandsValidation), getBrands);

router
  .route("/:slug")
  .get(validate(slugValidation), getBrand)
  .delete(
    auth,
    roleGuardMiddleware("ADMIN"),
    validate(slugValidation),
    deleteBrand
  )
  .patch(
    auth,
    roleGuardMiddleware("ADMIN"),
    uploadPublicFile.single("logo"),
    validate(updateBrandValidation),
    updateBrand
  );

module.exports = router;
