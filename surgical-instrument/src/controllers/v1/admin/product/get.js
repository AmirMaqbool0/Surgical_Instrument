"use strict";

const { Product } = require("@src/models");
const { VerifyAdminAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  VerifyAdminAuth(),
  async function getAllProductAdminV1Controller(req, res) {
    try {
      const products = await Product.find({
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      })
        

      return response.send(
        1,
        STATUS_CODE.OK,
        "Products fetched successfully",
        products,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch products",
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
 * /v1/admin/product/get:
 *   get:
 *     tags: [Admin Product]
 *     summary: Get all products
 *     description: Fetches all products that are not soft deleted, sorted by name.
 *     responses:
 *       '200':
 *         description: Products fetched successfully
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
 *                       short_desc:
 *                         type: string
 *                         example: "High-quality stainless steel surgical scissors"
 *                       long_desc:
 *                         type: string
 *                         example: "Designed for precision cutting in medical applications."
 *                       price:
 *                         type: number
 *                         example: 49.99
 *                       manufacturer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "65f1d2c5b5e6a2b8a1d3b230"
 *                           name:
 *                             type: string
 *                             example: "MedTech Instruments"
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "65f1e8f9b6d7c3a5a1d3f456"
 *                           name:
 *                             type: string
 *                             example: "Surgical Tools"
 *                       quantity:
 *                         type: integer
 *                         example: 100
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                       created_by:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "65f1a8c9b7e6b2a3a1d3f789"
 *                           username:
 *                             type: string
 *                             example: "admin123"
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
 *                   example: "Couldn't fetch products"
 *                 error:
 *                   type: string
 *                   example: "Error details here"
 */
