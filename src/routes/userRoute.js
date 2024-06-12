const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/verifyEmail/:token", authController.verifyEmail);

router.route("/").get(authController.protect, userController.getAllUser);

module.exports = router;
