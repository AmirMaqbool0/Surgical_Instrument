"use strict";

const { Product } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  VerifyAdminAuth(),
  validate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  async function getProductAdminV1Controller(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findOne({
        _id: id,
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      })
        .populate("manufacturer_id", "name")
        .populate("category_id", "name")

      if (!product) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "Product not found",
          null,
          res
        );
      }

      return response.send(
        1,
        STATUS_CODE.OK,
        "Product details fetched successfully",
        product,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch product details",
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
 * tags:
 *   name: Product
 *   description: APIs for product operations
 */

/**
 * @swagger
 * /v1/admin/product/get/{id}:
 *   get:
 *     tags: [Admin Product]
 *     summary: Get details of a specific product by ID
 *     description: Fetches details of a product using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       '200':
 *         description: Product details fetched successfully
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
 *                   example: "Product details fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64fe9e30f2b9a9b5d1f6b123"
 *                     name:
 *                       type: string
 *                       example: "Surgical Scissors"
 *                     short_desc:
 *                       type: string
 *                       example: "High-quality stainless steel surgical scissors"
 *                     long_desc:
 *                       type: string
 *                       example: "Designed for precision cutting in medical applications."
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 49.99
 *                     manufacturer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "65f1d2c5b5e6a2b8a1d3b230"
 *                         name:
 *                           type: string
 *                           example: "MedTech Instruments"
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "65f1e8f9b6d7c3a5a1d3f456"
 *                         name:
 *                           type: string
 *                           example: "Surgical Tools"
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                     created_by:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "65f1a8c9b7e6b2a3a1d3f789"
 *                         username:
 *                           type: string
 *                           example: "admin123"
 *       '404':
 *         description: Product not found
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
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       '500':
 *         description: Internal server error
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
 *                   example: "Couldn't fetch product details"
 */
