"use strict";

const { Manufacturer } = require("@src/models");
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
  async function showManufacturerAdminV1Controller(req, res) {
    try {
      const { id } = req.params;

      const manufacturer = await Manufacturer.findOne({
        _id: id,
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      });

      console.log(manufacturer);
      if (!manufacturer) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "Manufacturer not found",
          null,
          res
        );
      }

      return response.send(
        1,
        STATUS_CODE.OK,
        "Manufacturer details fetched successfully",
        manufacturer,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch manufacturer details",
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
 *   name: Manufacturer
 *   description: APIs for manufacturer operations
 */

/**
 * @swagger
 * /v1/admin/manufacturer/get/{id}:
 *   get:
 *     tags: [Admin Manufacturer]
 *     summary: Get details of a specific manufacturer by ID
 *     description: Fetches details of a manufacturer using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manufacturer
 *     responses:
 *       '200':
 *         description: Manufacturer details fetched successfully
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
 *                   example: "Manufacturer details fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64fe9e30f2b9a9b5d1f6b123"
 *                     name:
 *                       type: string
 *                       example: "Samsung"
 *                     description:
 *                       type: string
 *                       example: "Leading manufacturer of electronic devices."
 *                     logo:
 *                       type: string
 *                       example: "https://example.com/path/to/logo.jpg"
 *                     currency:
 *                       type: string
 *                       example: "USD"
 *                     country:
 *                       type: string
 *                       example: "United States"
 *                     state:
 *                       type: string
 *                       example: "California"
 *                     city:
 *                       type: string
 *                       example: "San Francisco"
 *                     area:
 *                       type: string
 *                       example: "Downtown"
 *                     delivery_charges:
 *                       type: number
 *                       format: float
 *                       example: 15.0
 *                     created_by:
 *                       type: string
 *                       example: "adminId123"
 *       '404':
 *         description: Manufacturer not found
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
 *                   example: "Manufacturer not found"
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
 *                   example: "Couldn't fetch manufacturer details"
 */
