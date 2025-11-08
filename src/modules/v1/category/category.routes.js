const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const {
  getCategoriesValidation,
  slugValidation,
} = require("./category.validation");
const { getCategories, getCategory } = require("./category.controller");

const router = Router();

router.get("/", validate(getCategoriesValidation), getCategories);

router.get("/:slug", validate(slugValidation), getCategory);

module.exports = router;
