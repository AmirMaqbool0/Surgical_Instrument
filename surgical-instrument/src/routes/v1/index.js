"use strict";

const { Router } = require("express");
const customer = require("./customer");
// const categories = require('./category')
const faqs = require('./faq')
const slider = require('./slider')
const ticket = require('./ticket')
const notification = require('./notification')
const rating = require('./rating')
const region = require('./region')
const admin = require('./admin')
const order = require('./order')
const instrumentCategory = require('./instrumentCategory')
const product = require('./product')
const manufacturer = require('./manufacturer')
const review = require('./review')
const newsEvent = require('./newsEvent')
const bundle = require('./bundle')

const router = Router();

router.use(customer);
// router.use(merchants);
// router.use(categories);
router.use(faqs);
router.use(slider);
router.use(ticket);
router.use(notification);
router.use(rating);
router.use(region);
router.use(admin)
router.use(order)
router.use(instrumentCategory)
router.use(product)
router.use(manufacturer)
router.use(review)
router.use(newsEvent)
router.use(bundle)

// ------------------------- Exports --------------------------------

module.exports = Router().use("/v1", router);