"use strict";

const {
  userLogoutController,
  loginCustomerController,
  signupCustomerController,
  

} = require("@src/controllers");
const { Router } = require("express");

const router = Router();

router.route("/login").post(loginCustomerController);

router.route("/registration")
    .post(signupCustomerController);



router.route("/logout")
  .get(userLogoutController);

// -----------------------------------Exports----------------------------------------------

module.exports = Router().use("/interaction", router);

 