"use strict";

const {
    getFilteredProductsV1Controller,
    getProductByIdV1Controller,
    getRelatedProductsV1Controller,
    getAllFeaturedProductsV1Controller,
} = require("@src/controllers");

const { Router } = require("express");

const router = Router();

router.route("/get")
    .post(getFilteredProductsV1Controller);


router.route("/get/featured")
    .get(getAllFeaturedProductsV1Controller);

router.route("/get/:id")
    .get(getProductByIdV1Controller);

router.route("/get/related")
    .post(getRelatedProductsV1Controller);



// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/product", router);
