const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const { updateCheckoutValidation } = require("./checkout.validation");
const {
  createCheckout,
  getCheckout,
  updateCheckout,
  deleteCheckout,
} = require("./checkout.controller");

const router = Router();

router.use(auth);

router
  .route("/")
  .post(createCheckout)
  .get(getCheckout)
  .patch(validate(updateCheckoutValidation), updateCheckout)
  .delete(deleteCheckout);

module.exports = router;
