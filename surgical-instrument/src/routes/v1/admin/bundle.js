"use strict";

const {createBundleAdminV1Controller,updateBundleAdminV1Controller,deleteBundleAdminV1Controller, getAllBundleAdminV1Controller} = require("@src/controllers");
const { Router } = require("express");

const router = Router();

router.route("/create")
    .post(createBundleAdminV1Controller);

router.route("/update/:id")
    .put(updateBundleAdminV1Controller);

router.route("/delete/:id")
    .delete(deleteBundleAdminV1Controller);

router.route("/get")
    .get(getAllBundleAdminV1Controller);

// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/bundle", router);