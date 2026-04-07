"use strict";

const {
    getAllManufacturersV1Controller
    
} = require("@src/controllers");

const { Router } = require("express");

const router = Router();



router.route('/get')
    .get(getAllManufacturersV1Controller);  




// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/manufacturer", router);
