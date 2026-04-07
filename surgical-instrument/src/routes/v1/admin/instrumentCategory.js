"use strict";

const {
    createInstrumentCategoryAdminV1Controller,
    updateInstrumentCategoryAdminV1Controller,
    deleteInstrumentCategoryAdminV1Controller,
    showInstrumentCategoryAdminV1Controller,
    getInstrumentCategoryAdminV1Controller
} = require("@src/controllers");

const { Router } = require("express");

const router = Router();

// Create a new instrument category
router.route('/create')
    .post(createInstrumentCategoryAdminV1Controller);

// Get all instrument categories
router.route('/get')
    .get(getInstrumentCategoryAdminV1Controller);

router.route('/get/:id')
    .get(showInstrumentCategoryAdminV1Controller);

router.route('/update/:id')
    .put(updateInstrumentCategoryAdminV1Controller);

router.route('/delete/:id')
    .delete(deleteInstrumentCategoryAdminV1Controller);

// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/instrument-category", router);
