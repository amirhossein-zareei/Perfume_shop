const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {cartItemsValidation} = require("./cart.validation");
const { getCart, addItemToCart } = require("./cart.controller");

const router = Router();

router.use(auth);

router.route("/").get(getCart);

router.post("/item", validate(cartItemsValidation), addItemToCart);

module.exports = router;
