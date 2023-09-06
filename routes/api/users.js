const express = require("express");
const passport = require("passport");
const userController = require("../../controllers/user");
const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.getUserProfile
);

module.exports = router;
