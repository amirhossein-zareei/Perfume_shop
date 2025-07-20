const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  createAddressValidation,
  updateAddressValidation,
} = require("./address.validation");
const {
  createAddress,
  getAddress,
  updateAddress,
  deleteAddress,
} = require("./address.controller");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");

const router = Router();

router.use(auth);

router.route("/").post(validate(createAddressValidation), createAddress);

router
  .route("/:addressId")
  .get(validateObjectIdMiddleware("addressId"), getAddress)
  .patch(
    validate(updateAddressValidation),
    validateObjectIdMiddleware("addressId"),
    updateAddress
  )
  .delete(
    validateObjectIdMiddleware("addressId"),
    deleteAddress
  );

module.exports = router;
