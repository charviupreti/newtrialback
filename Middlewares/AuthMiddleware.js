const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) return res.json({ status: true, user: user });
      else return res.json({ status: false });
    }
  });
};
