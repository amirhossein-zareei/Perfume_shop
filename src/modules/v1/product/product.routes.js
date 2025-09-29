const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");
const { getProducts } = require("./product.validation");
const { getPublicProducts } = require("./product.controller");

const router = Router();

router.get("/", validate(getProducts), getPublicProducts);

module.exports = router;
