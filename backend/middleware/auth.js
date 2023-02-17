const jwt = require("jsonwebtoken");
const User = require("../modal/User.model");
require("dotenv").config();

exports.isAuthenticate = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.send(401).json({
      message: "Please login first",
    });
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRETE);
  req.user = await User.findById(decoded._id);
  next();
};
