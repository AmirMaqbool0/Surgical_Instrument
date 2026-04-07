"use strict";

const { getFeaturedNewsEventV1Controller } = require("@src/controllers");

const {Router} = require("express");

const router = Router();


router.route("/getAll")
    .get(getFeaturedNewsEventV1Controller);

// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/news-event", router);