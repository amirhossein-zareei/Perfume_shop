const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const { updateMeValidation } = require("./user.validation");
const { getMe, deleteMe, updateMe } = require("./user.controller");

const router = Router();

router
  .route("/me")
  .get(auth, getMe)
  .delete(auth, deleteMe)
  .patch(auth, validate(updateMeValidation), updateMe);

module.exports = router;
