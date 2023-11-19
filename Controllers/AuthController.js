const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, preferences } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with same email or username.",
        success: false,
      });
    }
    const user = await User.create({ email, password, username, preferences });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Unable to create user", success: false });
    }
    const token = createSecretToken(user._id);
    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      user,
      token,
    });
    next();
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering", success: false });
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: "User does not exist." });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password." });
    }
    const token = createSecretToken(user._id);
    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      user,
      token,
    });
    next();
  } catch (error) {
    console.error(error);
  }
};
