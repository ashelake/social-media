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

exports.following = async (req, res) => {
  try {
    const userTofollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);
    if(!userTofollow){
      return res.status(400).json({
        
      })
    }
  } catch (error) {}
};
