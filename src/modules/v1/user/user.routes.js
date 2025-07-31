const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");
const { uploadAvatar } = require("../../../middlewares/uploadMiddleware");
const {
  updateMeValidation,
  changeRoleValidation,
  getOrdersValidation,
  getUsersValidation,
} = require("./user.validation");
const {
  getMe,
  deleteMe,
  updateMe,
  uploadProfileImage,
  getAddresses,
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

  uploadAvatar.single("profileImage"),
  uploadProfileImage
);

router.route("/me/addresses").get(getAddresses);

router.get(
  "/:userId/addresses",
  roleGuardMiddleware("ADMIN"),
  validateObjectIdMiddleware("userId"),
  getUserAddresses
);

router.get("/me/orders", validate(getOrdersValidation), getOrders);

router.get(
  "/",
  roleGuardMiddleware("ADMIN"),
  validate(getUsersValidation),
  getUsers
);

router
  .route("/:userId")
  .get(
    roleGuardMiddleware("ADMIN"),
    validateObjectIdMiddleware("userId"),
    getUser
  );

router.patch(
  "/:userId/role",
  roleGuardMiddleware("ADMIN"),
  validateObjectIdMiddleware("userId"),
  validate(changeRoleValidation),
  changeRole
);

router.patch(
  "/:userId/ban",
  roleGuardMiddleware("ADMIN"),
  validateObjectIdMiddleware("userId"),
  banUser
);

router.patch(
  "/:userId/unban",
  roleGuardMiddleware("ADMIN"),
  validateObjectIdMiddleware("userId"),
  unbanUser
);

router.patch(
  "/:userId/reactivate",
  roleGuardMiddleware("ADMIN"),
  validateObjectIdMiddleware("userId"),
  reactivateUser
);

module.exports = router;
