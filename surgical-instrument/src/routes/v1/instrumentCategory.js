"use strict";

const {
    getAllInstrumentCategoriesController
} = require("@src/controllers");
const { Router } = require("express");

const router = Router();

router.route('/get')
    .get(getAllInstrumentCategoriesController)


// -----------------------------------Exports----------------------------------------------

module.exports = Router().use("/instrument-category", router);