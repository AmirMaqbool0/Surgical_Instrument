"use strict";

const { Order, Customer } = require("@src/models");
const { verifyAuth, validate } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { Joi } = require("@src/lib");
const { response } = require("@src/utils");

const CONTROLLER = [
  verifyAuth(),
  validate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  async function getOrderV1Controller(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({
        _id: id,
        deleted_at: null,
      }).select("customer_id delivery_info status cart_info order_number").lean();
      

      if (!order) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Order not found", null, res);
      }

      return response.send(1, STATUS_CODE.OK, "Order status fetched successfully", order, res);
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch order status",
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
 * /v1/order/show/{id}:
 *   get:
 *     tags: [Order]
 *     summary: Check the status of a specific order
 *     description: Returns the current delivery status, delivery date, and order status for a specific order.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to check
 *     responses:
 *       200:
 *         description: Order status fetched successfully
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
 *                   example: "Order status fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_number:
 *                       type: string
 *                       example: "ORD123456"
 *                     status:
 *                       type: string
 *                       example: "PENDING"
 *                     delivery_info:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "delivered"
 *                         delivery_date:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-10T00:00:00Z"
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

