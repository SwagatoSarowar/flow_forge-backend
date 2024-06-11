const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUser = catchAsync(async function (req, res, next) {
  const users = await User.find().populate("workspaces");
  res.status(200).json({ status: "success", data: { users } });
});
