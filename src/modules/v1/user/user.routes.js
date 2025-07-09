const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const {
  updateMeValidation,
  createAddressValidation,
  updateAddressValidation,
  deleteAddressValidation,
  getUserValidation,
  changeRoleValidation,
  banUserValidation,
  unbanUserValidation,
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
} = require("./user.controller");
const { uploadPrivateFile } = require("../../../middlewares/uploadMiddleware");

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

router.get("/me/orders", auth, getOrders);

router.get("/", auth, roleGuardMiddleware("ADMIN"), getUsers);

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

// /:userId/reactivate

module.exports = router;
