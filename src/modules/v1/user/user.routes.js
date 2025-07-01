const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  updateMeValidation,
  createAddressValidation,
  updateAddressValidation,
  deleteAddressValidation,
} = require("./user.validation");
const {
  getMe,
  deleteMe,
  updateMe,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
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

router
  .route("/me/addresses/:addressId")
  .patch(auth, validate(updateAddressValidation), updateAddress)
  .delete(auth, validate(deleteAddressValidation), deleteAddress);
module.exports = router;
