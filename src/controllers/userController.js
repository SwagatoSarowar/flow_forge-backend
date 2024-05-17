const User = require("../models/userModel");

exports.getAllUser = async function (req, res) {
  const users = await User.find();
  res.status(200).json({ status: "success", data: { users } });
};
