"use strict";
const {
    createOrderV1Controller,
    deleteOrderV1Controller,
    getOrderV1Controller,
    getAllOrdersV1Controller,
    updateOrderV1Controller

}
= require("@src/controllers");
const { Router } = require("express");

const router = Router();

router.route('/create')
    .post(createOrderV1Controller),

router.route('/delete/:id')
    .delete(deleteOrderV1Controller),

router.route('/show/:id')
    .get(getOrderV1Controller),

// router.route('/get')
//     .get(getAllOrdersV1Controller);

router.route('/update/:id')
    .put(updateOrderV1Controller);

// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/order", router);
