"use strict";

const { InstrumentCategory } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const { STATUS_CODE, RESPONSE_ACTION } = require("@src/constants");
const { response } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  VerifyAdminAuth(),
  validate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  async function showInstrumentCategoryAdminV1Controller(req, res) {
    try {
      const { id } = req.params;

      
      const category = await InstrumentCategory.findOne({
        _id: id,
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      });
      
      console.log(category);
      if (!category) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "Instrument category not found",
          null,
          res
        );
      }

      return response.send(
        1,
        STATUS_CODE.OK,
        "Instrument category details fetched successfully",
        category,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch instrument category details",
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
 *   name: Instrument Category
 *   description: APIs for instrument category operations
 */

/**
 * @swagger
 * /v1/admin/instrument-category/get/{id}:
 *   get:
 *     tags: [Admin Instrument Category]
 *     summary: Get details of a specific instrument category by ID
 *     description: Fetches details of an instrument category using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the instrument category
 *     responses:
 *       '200':
 *         description: Instrument category details fetched successfully
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
 *                   example: "Instrument category details fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64fe9e30f2b9a9b5d1f6b123"
 *                     name:
 *                       type: string
 *                       example: "Guitar"
 *                     description:
 *                       type: string
 *                       example: "String instrument"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/path/to/image.jpg"
 *                     display_order:
 *                       type: integer
 *                       example: 1
 *                     created_by:
 *                       type: string
 *                       example: "adminId123"
 *       '404':
 *         description: Instrument category not found
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
 *                   example: "Instrument category not found"
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
 *                   example: "Couldn't fetch instrument category details"
 */
