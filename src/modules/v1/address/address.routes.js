const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  createAddressValidation,
  updateAddressValidation,
} = require("./address.validation");
const {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
} = require("./address.controller");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");

const router = Router();

router.use(auth);

router
  .route("/")
  .post(validate(createAddressValidation), createAddress)
  .get(getAddresses);

router
  .route("/:addressId")
  .get(validateObjectIdMiddleware("addressId"), getAddress)
  .patch(
    validate(updateAddressValidation),
    validateObjectIdMiddleware("addressId"),
    updateAddress
  )
  .delete(validateObjectIdMiddleware("addressId"), deleteAddress);

module.exports = router;
