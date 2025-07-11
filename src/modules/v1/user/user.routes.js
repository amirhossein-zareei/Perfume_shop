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
  getOrders,
  getUsers,
  getUser,
  changeRole,
  banUser,
  unbanUser,
  reactivateUser,
} = require("./user.controller");

const router = Router();

router
  .route("/me")
  .get(auth, getMe)
  .delete(auth, deleteMe)
  .patch(auth, validate(updateMeValidation), updateMe);

router.post(
  "/me/avatar",
  auth,
  uploadPrivateFile.single("profileImage"),
  uploadProfileImage
);

router
  .route("/me/addresses")
  .get(auth, getAddresses)
  .post(auth, validate(createAddressValidation), createAddress);

router
  .route("/me/addresses/:addressId")
  .patch(auth, validate(updateAddressValidation), updateAddress)
  .delete(auth, validate(deleteAddressValidation), deleteAddress);

router.get("/me/orders", auth, validate(getOrdersValidation), getOrders);

router.get(
  "/",
  auth,
  roleGuardMiddleware("ADMIN"),
  validate(getUsersValidation),
  getUsers
);

router
  .route("/:userId")
  .get(
    auth,
    validate(getUserValidation),
    roleGuardMiddleware("ADMIN"),
    getUser
  );

router.patch(
  "/:userId/role",
  auth,
  roleGuardMiddleware("ADMIN"),
  validate(changeRoleValidation),
  changeRole
);

router.patch(
  "/:userId/ban",
  auth,
  roleGuardMiddleware("ADMIN"),
  validate(banUserValidation),
  banUser
);

router.patch(
  "/:userId/unban",
  auth,
  roleGuardMiddleware("ADMIN"),
  validate(unbanUserValidation),
  unbanUser
);

router.patch(
  "/:userId/reactivate",
  auth,
  roleGuardMiddleware("ADMIN"),
  validate(reactivateUserValidation),
  reactivateUser
);

module.exports = router;
