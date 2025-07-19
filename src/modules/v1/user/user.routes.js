const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const { uploadPrivateFile } = require("../../../middlewares/uploadMiddleware");
const {
  updateMeValidation,
  createAddressValidation,
  updateAddressValidation,
  deleteAddressValidation,
  getUserValidation,
  changeRoleValidation,
  banUserValidation,
  unbanUserValidation,
  reactivateUserValidation,
  getOrdersValidation,
  getUsersValidation,
} = require("./user.validation");
const {
  getMe,
  deleteMe,
  updateMe,
  uploadProfileImage,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getUserAddresses,
  getOrders,
  getUsers,
  getUser,
  changeRole,
  banUser,
  unbanUser,
  reactivateUser,
} = require("./user.controller");

const router = Router();

router.use(auth);

router
  .route("/me")
  .get(getMe)
  .delete(deleteMe)
  .patch(validate(updateMeValidation), updateMe);

router.post(
  "/me/avatar",

  uploadPrivateFile.single("profileImage"),
  uploadProfileImage
);

router
  .route("/me/addresses")
  .get(getAddresses)
  .post(validate(createAddressValidation), createAddress);

router
  .route("/me/addresses/:addressId")
  .patch(validate(updateAddressValidation), updateAddress)
  .delete(validate(deleteAddressValidation), deleteAddress);

router.get("/:userId/addresses", roleGuardMiddleware("ADMIN"), getUserAddresses);

router.get("/me/orders", validate(getOrdersValidation), getOrders);

router.get(
  "/",

  roleGuardMiddleware("ADMIN"),
  validate(getUsersValidation),
  getUsers
);

router
  .route("/:userId")
  .get(roleGuardMiddleware("ADMIN"), validate(getUserValidation), getUser);

router.patch(
  "/:userId/role",

  roleGuardMiddleware("ADMIN"),
  validate(changeRoleValidation),
  changeRole
);

router.patch(
  "/:userId/ban",

  roleGuardMiddleware("ADMIN"),
  validate(banUserValidation),
  banUser
);

router.patch(
  "/:userId/unban",

  roleGuardMiddleware("ADMIN"),
  validate(unbanUserValidation),
  unbanUser
);

router.patch(
  "/:userId/reactivate",

  roleGuardMiddleware("ADMIN"),
  validate(reactivateUserValidation),
  reactivateUser
);

module.exports = router;
