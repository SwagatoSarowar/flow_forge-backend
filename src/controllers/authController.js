const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.signup = catchAsync(async function (req, res) {
  const { name, email, password, confirmPassword } = req.body;
  try {
    const user = await User.create({ name, email, password, confirmPassword });
    res.status(201).json({ status: "success", data: { user } });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
});

exports.signin = catchAsync(async function (req, res) {
  const { email, password } = req.body;
});
