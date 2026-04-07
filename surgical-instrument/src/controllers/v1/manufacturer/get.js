"use strict";

const { Manufacturer } = require("@src/models");
const { verifyAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  verifyAuth(),
  async function getAllManufacturersV1Controller(req, res) {
    try {
      const manufacturers = await Manufacturer.find({
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      }).sort({ name: 'asc' });

      return response.send(
        1,
        STATUS_CODE.OK,
        "Manufacturers fetched successfully",
        manufacturers,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch manufacturers",
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
 * /v1/manufacturer/get:
 *   get:
 *     tags: [Manufacturer]
 *     summary: Get all manufacturers
 *     description: Fetches all manufacturers that are not soft deleted, sorted by name.
 *     responses:
 *       '200':
 *         description: Manufacturers fetched successfully
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
 *                   example: "Manufacturers fetched successfully"
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
 *                         example: "Samsung"
 *                       description:
 *                         type: string
 *                         example: "Leading manufacturer of electronics and instruments."
 *                       logo:
 *                         type: string
 *                         example: "https://example.com/path/to/logo.jpg"
 *                       currency:
 *                         type: string
 *                         example: "USD"
 *                       country:
 *                         type: string
 *                         example: "USA"
 *                       state:
 *                         type: string
 *                         example: "California"
 *                       city:
 *                         type: string
 *                         example: "Los Angeles"
 *                       area:
 *                         type: string
 *                         example: "Downtown"
 *                       delivery_charges:
 *                         type: number
 *                         example: 10.5
 *                       created_by:
 *                         type: string
 *                         example: "adminId123"
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
 *                   example: "Couldn't fetch manufacturers"
 *                 error:
 *                   type: string
 *                   example: "Error details here"
 */
