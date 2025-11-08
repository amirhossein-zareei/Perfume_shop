const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { getBrandsValidation, slugValidation } = require("./brand.validation");
const { getBrands, getBrand } = require("./brand.controller");

const router = Router();

router.get("/", validate(getBrandsValidation), getBrands);

router.get("/:slug", validate(slugValidation), getBrand);

module.exports = router;
