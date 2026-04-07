"use strict";

const { Product } = require("@src/models");
const { Types } = require("mongoose");
const { verifyAuth, validate } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  verifyAuth(),
  validate({
    body: Joi.object().keys({
      category_id: Joi.string().required(),
      manufacturer_id: Joi.string().optional(), 
      min_price: Joi.number().min(0).optional(),
      max_price: Joi.number().min(0).optional(),
      min_quantity: Joi.number().min(0).optional(),
      max_quantity: Joi.number().min(0).optional(),
      search: Joi.string().optional(), 
    }),
  }),
  async function getFilteredProductsV1Controller(req, res) {
    try {
      const { category_id, manufacturer_id, min_price, max_price, min_quantity, max_quantity, search } = req.body;

      let filter = {
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      };

      // Apply filters dynamically
      if (category_id) filter.category_id = new Types.ObjectId(category_id);
      if (manufacturer_id) filter.manufacturer_id = new Types.ObjectId(manufacturer_id);
      if (min_price !== undefined || max_price !== undefined) {
        filter.price = {};
        if (min_price !== undefined) filter.price.$gte = min_price;
        if (max_price !== undefined) filter.price.$lte = max_price;
      }
      if (min_quantity !== undefined || max_quantity !== undefined) {
        filter.quantity = {};
        if (min_quantity !== undefined) filter.quantity.$gte = min_quantity;
        if (max_quantity !== undefined) filter.quantity.$lte = max_quantity;
      }
      if (search) filter.name = { $regex: search, $options: "i" }; // Case-insensitive search

      const products = await Product.find(filter)
        .populate("manufacturer_id", "name")
        .populate("category_id", "name");

      return response.send(1, STATUS_CODE.OK, "Products fetched successfully", products, res);
    } catch (error) {
      console.error(error);
      return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't fetch products", null, res, error);
    }
  },
];

module.exports = CONTROLLER;


/**
 * @swagger
 * /v1/product/get:
 *   post:
 *     tags: [Product]
 *     summary: Get products with filters
 *     description: Retrieve products based on multiple filtering options such as category, manufacturer, price range, quantity range, and search.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: string
 *                 example: "65f1e8f9b6d7c3a5a1d3f456"
 *                 description: (Optional) The ID of the category to filter products.
 *               manufacturer_id:
 *                 type: string
 *                 example: "65f1e8f9b6d7c3a5a1d3f789"
 *                 description: (Optional) The ID of the manufacturer to filter products.
 *               min_price:
 *                 type: number
 *                 example: 10.50
 *                 description: (Optional) Minimum price filter.
 *               max_price:
 *                 type: number
 *                 example: 100.00
 *                 description: (Optional) Maximum price filter.
 *               min_quantity:
 *                 type: number
 *                 example: 5
 *                 description: (Optional) Minimum stock quantity filter.
 *               max_quantity:
 *                 type: number
 *                 example: 50
 *                 description: (Optional) Maximum stock quantity filter.
 *               search:
 *                 type: string
 *                 example: "Surgical Scissors"
 *                 description: (Optional) Search products by name (case-insensitive).
 *     responses:
 *       '200':
 *         description: Products fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Products fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "65fe9e30f2b9a9b5d1f6b123"
 *                       name:
 *                         type: string
 *                         example: "Surgical Scissors"
 *                       price:
 *                         type: number
 *                         example: 25.99
 *                       quantity:
 *                         type: number
 *                         example: 15
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "65f1e8f9b6d7c3a5a1d3f456"
 *                           name:
 *                             type: string
 *                             example: "Surgical Tools"
 *                       manufacturer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "65f1e8f9b6d7c3a5a1d3f789"
 *                           name:
 *                             type: string
 *                             example: "MedTech"
 *       '422':
 *         description: Validation error due to incorrect or missing parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status_code:
 *                   type: integer
 *                   example: 422
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "'category_id' must be a valid string."
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["category_id"]
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Couldn't fetch products"
 */
