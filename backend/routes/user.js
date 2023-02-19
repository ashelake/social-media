const express = require("express");
const {
  register,
  login,
  following,
  logout,
  updatePassword,
  updateProfile,
} = require("../controller/user");
const { isAuthenticate } = require("../middleware/auth");

const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticate, logout);

router.route("/follow/:id").get(isAuthenticate, following);

router.route("/update/password").put(isAuthenticate, updatePassword);
router.route("/update/profile").put(isAuthenticate, updateProfile);

module.exports = router;
