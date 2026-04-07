"use strict";

const {updateOrderStatusV1Controller,getSingleOrderV1Controller,getAllOrdersV1Controller} = require("@src/controllers/v1/admin/order");
const { Router } = require("express");

const router = Router();

router.route("/getAll")
    .get(getAllOrdersV1Controller);

router.route("/get/:id")
    .get(getSingleOrderV1Controller);

router.route("/update/:id")
    .put(updateOrderStatusV1Controller);

// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/order", router);