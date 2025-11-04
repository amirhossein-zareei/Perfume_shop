const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  updateCheckoutValidation,
  verifyPaymentValidation,
} = require("./checkout.validation");
const {
  createCheckout,
  getCheckout,
  updateCheckout,
  cancelCheckout,
  initiatePayment,
  handlePaymentCallback,
} = require("./checkout.controller");

const router = Router();

router.use(auth);

router
  .route("/")
  .post(createCheckout)
  .get(getCheckout)
  .patch(validate(updateCheckoutValidation), updateCheckout)
  .delete(cancelCheckout);

router.post("/payment", initiatePayment);

module.exports = router;
