"use strict";

const {
    updateCustomerProfileV1Controller,
} = require("@src/controllers");

const { Router } = require("express");

const router = Router();

router.route("/update/:id").put(updateCustomerProfileV1Controller);

module.exports = Router().use("/profile", router);
