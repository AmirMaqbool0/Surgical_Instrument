"use strict";

const { Bundle } = require("@src/models");
const { verifyAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  verifyAuth(),
  async function getActiveBundlesV1Controller(req, res) {
    try {
      const bundles = await Bundle.find({
        $and: [
          { $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }] },
          { is_featured: true },
        ],
      }).sort({ display_order: 'asc' });

      return response.send(
        1,
        STATUS_CODE.OK,
        "Bundles fetched successfully",
        bundles,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch bundles",
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
 * /v1/bundle/get:
 *   get:
 *     tags: [Bundle]
 *     summary: Get all active and featured bundles
 *     description: Fetches all bundles that are active and marked as featured.
 *     responses:
 *       '200':
 *         description: Bundles fetched successfully
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
 *                   example: "Bundles fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d21b467c213e0017e6e31d"
 *                       name:
 *                         type: string
 *                         example: "Starter Kit"
 *                       image:
 *                         type: string
 *                         example: "https://example.com/bundle-image.jpg"
 *                       pack_size:
 *                         type: number
 *                         example: 5
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product_id:
 *                               type: string
 *                               example: "60d21b467c213e0017e6e31d"
 *                             quantity:
 *                               type: number
 *                               example: 1
 *                       price:
 *                         type: number
 *                         example: 99.99
 *                       display_order:
 *                         type: number
 *                         example: 1
 *                       is_featured:
 *                         type: boolean
 *                         example: true
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
 *                   example: "Couldn't fetch bundles"
 *                 error:
 *                   type: string
 *                   example: "Error details here"
 */
