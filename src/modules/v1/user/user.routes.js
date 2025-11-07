const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const { uploadAvatar } = require("../../../middlewares/uploadMiddleware");
const {
  updateMeValidation,
} = require("./user.validation");
const {
  getMe,
  deleteMe,
  updateMe,
  uploadProfileImage,
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

module.exports = router;
