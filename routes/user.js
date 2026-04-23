const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const userController = require("../controllers/userContoller.js");
const { isLoggedIn, saveRedirectUrl } = require("../middleware/isLoggedIn.js");

// ================= SIGNUP =================

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.createUser);

// ================= LOGIN =================

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser,
  );

// ================= LOGOUT =================

router.get("/logout", userController.logoutUser);

module.exports = router;
