const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  getOrdersValidation,
  orderNumberValidation,
} = require("./order.validation");
const { getOrders, getOrder, cancelOrder } = require("./order.controller");

const router = Router();

router.use(auth);

router.get("/", validate(getOrdersValidation), getOrders);

router.get("/:orderNumber", validate(orderNumberValidation), getOrder);

router.post("/:orderNumber/cancel", validate(orderNumberValidation), cancelOrder);

module.exports = router;
