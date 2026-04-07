"use strict";

const { Router } = require("express");
const instrumentCategory = require('./instrumentCategory');
const manufacturer = require('./manufacturer');
const product = require('./product');
const review = require('./review');
const profile = require('./profile');
const newsEvent = require('./newsEvent');
const bundle = require('./bundle');
const order = require('./order');
const router = Router();

router.use(instrumentCategory);
router.use(manufacturer);
router.use(product);
router.use(review);
router.use(profile);
router.use(newsEvent);
router.use(bundle);
router.use(order);


// ------------------------- Exports --------------------------------

module.exports = Router().use("/admin", router);