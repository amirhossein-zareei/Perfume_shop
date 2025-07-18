const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const { uploadPublicFile } = require("../../../middlewares/uploadMiddleware");
const {
  createCategoryValidation,
  getCategoriesValidation,
  slugValidation,
  updatedCategoryValidation,
} = require("./category.validation");
const {
  createCategory,
  getCategories,
  getCategory,
  deleteCategory,
  updatedCategory,
} = require("./category.controller");

const router = Router();

router
  .route("/")
  .post(
    auth,
    roleGuardMiddleware("ADMIN"),
    uploadPublicFile.single("icon"),
    validate(createCategoryValidation),
    createCategory
  )
  .get(validate(getCategoriesValidation), getCategories);

router
  .route("/:slug")
  .get(validate(slugValidation), getCategory)
  .delete(
    auth,
    roleGuardMiddleware("ADMIN"),
    validate(slugValidation),
    deleteCategory
  )
  .patch(
    auth,
    roleGuardMiddleware("ADMIN"),
    uploadPublicFile.single("icon"),
    validate(updatedCategoryValidation),
    updatedCategory,
  );

module.exports = router;
