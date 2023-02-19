const { findById } = require("../modal/User.model.js");
const User = require("../modal/User.model.js");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User alredy exists",
      });
    }

    user = await User.create({
      name,
      email,
      password,
      avtar: { public_id: "sample", url: "sample" },
    });

    const token = await user.generateToken();

    res.status(201).cookie("token", token).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.isMatchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password Incorrect",
      });
    }

    const token = await user.generateToken();

    res.status(200).cookie("token", token).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).cookie("token", null).json({
      success: true,
      message: "User Logged Out",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.following = async (req, res) => {
  try {
    const userTofollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);
    if (!userTofollow) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }
    if (loggedInUser.following.includes(userTofollow._id)) {
      loggedInUser.following.splice(
        loggedInUser.following.indexOf(userTofollow._id),
        1
      );
      userTofollow.followers.splice(
        userTofollow.followers.indexOf(loggedInUser._id),
        1
      );
      userTofollow.save();
      loggedInUser.save();
      res.status(200).json({
        success: true,
        message: "User Unfollwed",
      });
    } else {
      userTofollow.followers.push(req.user._id);
      loggedInUser.following.push(req.params.id);
      userTofollow.save();
      loggedInUser.save();
      res.status(200).json({
        success: true,
        message: "User follwed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const { oldPassword, newPassword } = req.body;

    isMatch = await user.isMatchPassword(oldPassword);

    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Old password Missmatch",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Changed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email } = req.body;

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


