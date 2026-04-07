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
      manufacturer_id: Joi.string().required(), 
    }),
  }),
  async function getRelatedProductsV1Controller(req, res) {
    try {
      const { category_id, manufacturer_id } = req.body;

    
      const RelatedProducts = await Product.find({
        category_id: new Types.ObjectId(category_id),
        manufacturer_id: { $ne: manufacturer_id },
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      })
        .populate("manufacturer_id", "name")
        .limit(4);
        
      return response.send(
        1,
        STATUS_CODE.OK,
        "Related products fetched successfully",
        { Related_products: RelatedProducts },
        res
      );
    } catch (error) {
      console.error(error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch Related products",
        null,
        res,
        error
      );
    }
  },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * /v1/product/get/related:
 *   post:
 *     tags: [Product]
 *     summary: Get Related products by category
 *     description: Fetches Related products that belong to the same category but from different manufacturers.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: string
 *                 example: "65f1e8f9b6d7c3a5a1d3f456"
 *                 description: The category ID to filter Related products.
 *               manufacturer_id:
 *                 type: string
 *                 example: "65f1e8f9b6d7c3a5a1d3f789"
 *                 description: The manufacturer ID of the current product (to exclude it from results).
 *     responses:
 *       '200':
 *         description: Related products fetched successfully.
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
 *                   example: "Related products fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Related_products:
 *                       type: array
 *                       description: List of Related products in the same category but from different manufacturers.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "65f2a3b8d7c3a5a1d3b789"
 *                           name:
 *                             type: string
 *                             example: "Premium Surgical Scissors"
 *                           price:
 *                             type: number
 *                             example: 59.99
 *                           manufacturer:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "65f1d8c3a5a1d3b2456"
 *                               name:
 *                                 type: string
 *                                 example: "SurgiPro"
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
 *                   example: "Couldn't fetch Related products"
 */
