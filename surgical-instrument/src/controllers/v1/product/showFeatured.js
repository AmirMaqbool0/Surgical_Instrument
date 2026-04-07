"use strict";

const { Product } = require("@src/models");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = async function getAllFeaturedProductsV1Controller(req, res) {
  try {
    console.log('halladfl')
    const products = await Product.find({ is_featured: true, deleted_at: null })
      .populate("manufacturer_id", "name")
      .populate("category_id", "name");

    return response.send(1, STATUS_CODE.OK, "Featured products fetched successfully", products, res);
  } catch (error) {
    console.error(error);
    return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't fetch featured products", null, res, error);
  }
};

module.exports = CONTROLLER;

/**
 * @swagger
 * /v1/product/get/featured:
 *   get:
 *     tags: [Product]
 *     summary: Get all featured products
 *     description: Returns all products that are marked as featured
 *     responses:
 *       200:
 *         description: Featured products fetched successfully
 *       500:
 *         description: Internal server error
 */
