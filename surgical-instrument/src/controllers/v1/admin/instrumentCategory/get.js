"use strict";

const { InstrumentCategory } = require("@src/models");
const { VerifyAdminAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  VerifyAdminAuth(),
  async function getInstrumentCategoryAdminV1Controller(req, res) {
    try {
        
      const categories = await InstrumentCategory.find({
        $or : [{deleted_at: null}, {deleted_at: { $exists: false }}],
      }).sort({ display_order: 'asc' });
      
      
      return response.send(
        1,
        STATUS_CODE.OK,
        "Instrument categories fetched successfully",
        categories,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch instrument categories",
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
 * /v1/admin/instrument-category/get:
 *   get:
 *     tags: [Admin Instrument Category]
 *     summary: Get all instrument categories
 *     responses:
 *       '200':
 *         description: Instrument categories fetched successfully
 *       '500':
 *         description: Internal server error
 */