const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const {
  getOrdersValidation,
  orderNumberValidation,
  changeOrderStatusValidation,
} = require("./order.validation");
const {
  getOrdersForAdmin,
  getOrderForAdmin,
  changeOrderStatus,
} = require("./order.controller");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

router.get("/", validate(getOrdersValidation), getOrdersForAdmin);

router.get("/:orderNumber", validate(orderNumberValidation), getOrderForAdmin);

router.patch(
  "/:orderNumber/status",
  validate(orderNumberValidation),
  validate(changeOrderStatusValidation),
  changeOrderStatus
);

module.exports = router;
