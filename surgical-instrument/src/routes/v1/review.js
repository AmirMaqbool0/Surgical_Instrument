"use strict";

const { Router } = require("express");
const { 
    createReviewV1Controller , updateReviewV1Controller, getAllReviewsV1Controller } = require("@src/controllers");
const router = Router();

router.route("/create")
    .post(createReviewV1Controller);

router.route("/update/:id")
    .put(updateReviewV1Controller);

router.route("/get")
    .post(getAllReviewsV1Controller);

module.exports = Router().use("/review", router);