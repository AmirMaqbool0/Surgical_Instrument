"use strict";

const { getActiveBundlesV1Controller } = require("@src/controllers");
const { Router } = require("express");

const router = Router();

router.route("/show")
    .get(getActiveBundlesV1Controller);

// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/bundle", router);