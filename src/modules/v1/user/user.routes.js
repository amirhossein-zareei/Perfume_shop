const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const { updateMeValidation, createAddressValidation } = require("./user.validation");
const {
  getMe,
  deleteMe,
  updateMe,
  getAddresses,
  createAddress
} = require("./user.controller");

const router = Router();

router
  .route("/me")
  .get(auth, getMe)
  .delete(auth, deleteMe)
  .patch(auth, validate(updateMeValidation), updateMe);

router
  .route("/me/addresses")
  .get(auth, getAddresses)
  .post(auth, validate(createAddressValidation), createAddress);

module.exports = router;
