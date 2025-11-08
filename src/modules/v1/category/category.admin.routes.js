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
  getAllCategoriesForAdmin,
  deleteCategory,
  updatedCategory,
  reactivateCategory,
} = require("./category.controller");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

router.post(
  "/",
  uploadIcon.single("icon"),
  validate(createCategoryValidation),
  createCategory
);

router.get("/", validate(getCategoriesValidation), getAllCategoriesForAdmin);

router
  .route("/:slug")
  .delete(validate(slugValidation), deleteCategory)
  .patch(
    uploadIcon.single("icon"),
    validate(updatedCategoryValidation),
    updatedCategory
  );

router.patch("/:slug/reactivate", validate(slugValidation), reactivateCategory);
module.exports = router;
