const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const roleGuardMiddleware = require("../../../middlewares/roleGuardMiddleware");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");
const {
  changeRoleValidation,
  getUsersValidation,
} = require("./user.validation");
const {
  getUserAddresses,
  getUsers,
  getUser,
  changeRole,
  banUser,
  unbanUser,
  reactivateUser,
} = require("./user.controller");

const router = Router();

router.use(auth);
router.use(roleGuardMiddleware("ADMIN"));

router.get(
  "/:userId/addresses",
  validateObjectIdMiddleware("userId"),
  getUserAddresses
);

router.get("/", validate(getUsersValidation), getUsers);

router.route("/:userId").get(validateObjectIdMiddleware("userId"), getUser);

router.patch(
  "/:userId/role",
  validateObjectIdMiddleware("userId"),
  validate(changeRoleValidation),
  changeRole
);

router.patch("/:userId/ban", validateObjectIdMiddleware("userId"), banUser);

router.patch("/:userId/unban", validateObjectIdMiddleware("userId"), unbanUser);

router.patch(
  "/:userId/reactivate",
  validateObjectIdMiddleware("userId"),
  reactivateUser
);

module.exports = router;
