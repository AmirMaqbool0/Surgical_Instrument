"use strict";

const { loginInteractionController,signupInteractionController} = require("@src/controllers");
const { Router } = require("express");

const router = Router();


router.route("/login").post(loginInteractionController);
router.route("/signup").post(signupInteractionController);



// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/interaction", router);
