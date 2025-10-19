const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");
const {
  cartItemsValidation,
  quantityValidation,
} = require("./cart.validation");
const {
  getCart,
  addItemToCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
} = require("./cart.controller");

const router = Router();

router.use(auth);

router.route("/").get(getCart);

router.post("/item", validate(cartItemsValidation), addItemToCart);

router.patch(
  "/item/:itemId/increase",
  validate(validateObjectIdMiddleware("itemId")),
  validate(quantityValidation),
  increaseCartItemQuantity
);
router.patch(
  "/item/:itemId/decrease",
  validate(validateObjectIdMiddleware("itemId")),
  validate(quantityValidation),
  decreaseCartItemQuantity
);

module.exports = router;
