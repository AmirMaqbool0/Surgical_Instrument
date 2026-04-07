"use strict";

const {
    createProductAdminV1Controller,
    updateProductAdminV1Controller,
    deleteProductAdminV1Controller,
    getProductAdminV1Controller,
    getAllProductAdminV1Controller,
    getFeaturedProductV1Controller,
} = require("@src/controllers");

const { Router } = require("express");

const router = Router();

router.route("/create").post(createProductAdminV1Controller);
router.route("/update/:id").put(updateProductAdminV1Controller);
router.route("/delete/:id").delete(deleteProductAdminV1Controller);
router.route("/get/:id").get(getProductAdminV1Controller);
router.route("/get").get(getAllProductAdminV1Controller);
router.route("/featured/:id").put(getFeaturedProductV1Controller);

// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/product", router);
