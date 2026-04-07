"use strict";

const { Router } = require("express");
const interaction = require("./interaction");
const token = require('./token')
const customer = require('./customer')
const router = Router();
const forgotpassword = require("./forgotpassword");
const admin = require("./admin");

router.use(interaction);
// router.use(token)
router.use(customer)
router.use(forgotpassword)
router.use(admin)


// ------------------------- Exports --------------------------------

module.exports = Router().use("/auth", router);