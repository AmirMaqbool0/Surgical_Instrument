"use strict";

const { Bundle } = require("@src/models");
const { VerifyAdminAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  VerifyAdminAuth(),
  async function getAllBundleAdminV1Controller(req, res) {
    try {

      const bundles = await Bundle.find({
        $or : [{deleted_at: null}, {deleted_at: { $exists: false }}],
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
 * /v1/admin/bundle/get:
 *   get:
 *     tags: [Admin Bundle]
 *     summary: Get all bundles
 *     responses:
 *       '200':
 *         description: Bundles fetched successfully
 *       '500':
 *         description: Internal server error
 */