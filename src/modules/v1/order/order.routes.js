const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const { getOrdersValidation } = require("./order.validation");
const { getOrders } = require("./order.controller");

const router = Router();

router.use(auth);

router.get("/", validate(getOrdersValidation), getOrders);

module.exports = router;
