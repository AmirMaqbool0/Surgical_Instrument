"use strict";

const {
    getAllSliderV1,
} = require("@src/controllers");
const { Router } = require("express");

const router = Router();

router.route('/get-all')
    .get(getAllSliderV1)

// -----------------------------------Exports----------------------------------------------

module.exports = Router().use("/slider", router);