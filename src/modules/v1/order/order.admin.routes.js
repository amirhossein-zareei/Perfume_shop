const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const {
  getOrdersValidation,
  orderNumberValidation,
} = require("./order.validation");
const { getOrdersForAdmin, getOrderForAdmin} = require("./order.controller");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

router.get("/", validate(getOrdersValidation), getOrdersForAdmin);

router.route("/:orderNumber").get(
  validate(orderNumberValidation),
  getOrderForAdmin
);

module.exports = router;
