"use strict";

const {
    getAllReviewsAdminV1Controller,
    updateReviewStatusAdminV1Controller,
    // deleteReviewAdminV1Controller
} = require("@src/controllers");

const { Router } = require("express");
const router = Router();

router.route("/get-all").get(getAllReviewsAdminV1Controller);
router.route("/update/:id").put(updateReviewStatusAdminV1Controller);
// router.route("/delete/:id").delete(deleteReviewAdminV1Controller);

// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/review", router);
