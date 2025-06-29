const { Router } = require("express");

const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  getMe,
  deleteMe,
} = require("./user.controller");

const router = Router();

router
  .route("/me")
  .get(auth, getMe)
  .delete(auth, deleteMe);

module.exports = router;
