const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { promisify } = require("util");

// =============== SIGN UP =================
exports.signup = catchAsync(async function (req, res) {
  const { name, email, password, confirmPassword } = req.body;
  const user = await User.create({ name, email, password, confirmPassword });

  const token = user.generateEmailVerificationToken();
  await user.save();

  const emailVerificationURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/verifyEmail/${token}`;

  // sending email to user
  try {
    sendEmail({
      email,
      subject: "Email verification link",
      message: `Verify your email by clicking this link ${emailVerificationURL}`,
    });

    res.status(200).json({
      status: "success",
      message:
        "Verification email has been sent to your email inbox. Please check your email to verify.",
    });
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    next(
      new AppError(
        "There was an error sending your verification email. Please try again later.",
        500
      )
    );
  }
});

// =============== SIGN IN =================
exports.signin = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide your email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.correctPassword(password, user.password)) {
    return next(new AppError("Email or Password incorrect"));
  }

  if (!user.isVerified) {
    return next(
      new AppError("Email is not verified. PLease verify your email first", 401)
    );
  }
  // JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Sending JWT through cookie
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });

  // hiding the user password.
  user.password = undefined;

  res.status(200).json({ status: "success", token, data: { user } });
});

// =============== VERIFY EMAIL =================
exports.verifyEmail = catchAsync(async function (req, res, next) {
  const { token } = req.params;

  const verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    verificationToken: verificationToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid token or token has been expired.", 400));
  }

  user.isVerified = true;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json({ status: "success", message: "Your email has been verified" });
});

// =============== PROTECTING ROUTE =================
exports.protect = catchAsync(async function (req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("Your are not logged in. Please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const loggedUser = await User.findById(decoded.id);

  if (!loggedUser) {
    return next(new AppError("User doesn't exist.", 402));
  }

  if (loggedUser.isPasswordChangedAfterJWT(decoded.iat)) {
    return next(
      new AppError("Password has been changed. Please login again.", 401)
    );
  }

  // sending user data to next middlewares
  req.user = loggedUser;

  next();
});
