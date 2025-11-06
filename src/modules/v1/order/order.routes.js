const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  getOrdersValidation,
  getOrderValidation,
} = require("./order.validation");
const { getOrders, getOrder } = require("./order.controller");

const router = Router();

router.use(auth);

router.get("/", validate(getOrdersValidation), getOrders);

router.get("/:orderNumber", validate(getOrderValidation), getOrder);

module.exports = router;
