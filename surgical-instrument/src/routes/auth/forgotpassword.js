"use strict";

const {
    sendOtpInterectionController,checkOtpInterectionController,resetPasswordInterectionController
} = require("@src/controllers");
const { Router } = require("express");

//-----------------------------------Route----------------------------------------------- 

const router = Router();
router.route('/send-otp')
    .post(sendOtpInterectionController)

router.route('/check-otp')
    .post(checkOtpInterectionController)

router.route('/reset-password')
    .post(resetPasswordInterectionController)

// -----------------------------------Exports----------------------------------------------

module.exports = Router().use("/forgot-password", router);