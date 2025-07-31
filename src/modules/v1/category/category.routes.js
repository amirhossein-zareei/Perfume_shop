const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const { uploadIcon } = require("../../../middlewares/uploadMiddleware");
const {
  createCategoryValidation,
  getCategoriesValidation,
  slugValidation,
  updatedCategoryValidation,
} = require("./category.validation");
const {
  createCategory,
  getCategories,
  getAllCategoriesForAdmin,
  getCategory,
  deleteCategory,
  updatedCategory,
  reactivateCategory,
} = require("./category.controller");

const router = Router();

router
  .route("/")
  .post(
    auth,
    roleGuardMiddleware("ADMIN"),
    uploadIcon.single("icon"),
    validate(createCategoryValidation),
    createCategory
  )
  .get(validate(getCategoriesValidation), getCategories);

router.get(
  "/all",
  auth,
  roleGuardMiddleware("ADMIN"),
  validate(getCategoriesValidation),
  getAllCategoriesForAdmin
);

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
    uploadIcon.single("icon"),
    validate(updatedCategoryValidation),
    updatedCategory
  );

router.patch(
  "/:slug/reactivate",
  auth,
  roleGuardMiddleware("ADMIN"),
  validate(slugValidation),
  reactivateCategory
);
module.exports = router;
