"use strict";

const { Router } = require("express");

const userInteraction = require("./interaction");
const router = Router();

router.use(userInteraction);

// ------------------------- Exports --------------------------------

module.exports = Router().use("/admin", router);