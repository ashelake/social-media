const express = require("express");
const { register, login, following } = require("../controller/user");
const { isAuthenticate } = require("../middleware/auth");

const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/follow/:id").get(isAuthenticate, following);

module.exports = router;
