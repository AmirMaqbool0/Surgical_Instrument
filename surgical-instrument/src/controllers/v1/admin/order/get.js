"use strict";

const { Order } = require("@src/models");
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
  async function getSingleOrderV1Controller(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({ _id: id, deleted_at: null });
      if (!order) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Order not found", null, res);
      }
      return response.send(1, STATUS_CODE.OK, "Order retrieved successfully", { order }, res);
    } catch (error) {
      console.error(error);
      return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't fetch order", null, res, error);
    }
  },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * /v1/admin/order/{id}:
 *   get:
 *     tags: [Admin Order]
 *     summary: Get order by ID
 *     description: Admin can fetch a single order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Order retrieved successfully
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
 *                   example: Order fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

