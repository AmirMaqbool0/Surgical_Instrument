"use strict";

const {
    updateAdminProfileV1Controller
} = require("@src/controllers");

const { Router } = require("express");

const router = Router();

router.route("/update/:id").put(updateAdminProfileV1Controller);

module.exports = Router().use("/profile", router);
