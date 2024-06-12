const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email.",
    },
  },
  image: String,
  password: {
    type: String,
    required: [true, "Please provide a password."],
    select: false,
  },
  confirmPassword: {
    type: String,
    require: [true, "Please confirm your password."],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Please make sure the confirm password is same as the password.",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  workspaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  ],
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashed = await bcrypt.hash(this.password, 12);
  this.password = hashed;
  this.confirmPassword = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  const isCorrect = await bcrypt.compare(candidatePassword, userPassword);
  return isCorrect;
};

userSchema.methods.generateEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.verificationTokenExpires = Date.now() + 10 * 60 * 1000;

  return verificationToken;
};

userSchema.methods.isPasswordChangedAfterJWT = function (jwtIssuesAt) {
  if (this.passwordChangedAt) {
    return new Date(this.passwordChangedAt).getTime() > jwtIssuesAt * 1000;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
