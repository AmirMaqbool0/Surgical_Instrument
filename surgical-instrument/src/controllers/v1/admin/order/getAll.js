"use strict";

const { Order } = require("@src/models");
const { VerifyAdminAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
    VerifyAdminAuth(),
  async function getAllOrdersV1Controller(req, res) {
    try {
      const orders = await Order.find({ deleted_at: null }).sort({ created_at: -1 });
      return response.send(1, STATUS_CODE.OK, "Orders retrieved successfully", { orders }, res);
    } catch (error) {
      console.error(error);
      return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't fetch orders", null, res, error);
    }
  },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * /v1/admin/order/getAll:
 *   get:
 *     tags: [Admin Order]
 *     summary: Get all orders
 *     description: Admin can fetch all non-deleted orders.
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Orders fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 */
