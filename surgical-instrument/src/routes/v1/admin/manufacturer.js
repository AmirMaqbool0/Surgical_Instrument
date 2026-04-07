"use strict";

const {
    createManufacturerAdminV1Controller,
    updateManufacturerAdminV1Controller,
    deleteManufacturerAdminV1Controller,
    getAllManufacturerAdminV1Controller,
    showManufacturerAdminV1Controller
} = require("@src/controllers");

const { Router } = require("express");

const router = Router();

router.route('/create')
    .post(createManufacturerAdminV1Controller);

router.route('/update/:id')
    .put(updateManufacturerAdminV1Controller);

router.route('/delete/:id')
    .delete(deleteManufacturerAdminV1Controller); 

router.route('/get')
    .get(getAllManufacturerAdminV1Controller);  

router.route('/get/:id')
    .get(showManufacturerAdminV1Controller);  



// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/manufacturer", router);
