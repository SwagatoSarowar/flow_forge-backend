const mongoose = require("mongoose");
const validator = require("validator");

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
});

const User = mongoose.model("User", userSchema);

module.exports = User;
