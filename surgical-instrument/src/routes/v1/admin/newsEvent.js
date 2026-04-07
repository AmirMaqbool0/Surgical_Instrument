"use strict";

const {
    createNewsEventV1Controller,
    updateNewsEventV1Controller,
    deleteNewsEventV1Controller,
    showNewsEventV1Controller,
} = require("@src/controllers");

const { Router } = require("express");

const router = Router();


router.route('/create')
    .post(createNewsEventV1Controller);

router.route('/show/:id')
    .get(showNewsEventV1Controller);

router.route('/update/:id')
    .put(updateNewsEventV1Controller);

router.route('/delete/:id')
    .delete(deleteNewsEventV1Controller);

// -----------------------------------Exports----------------------------------------------
module.exports = Router().use("/news-event", router);
