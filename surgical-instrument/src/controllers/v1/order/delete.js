"use strict";

const { Order } = require("@src/models");
const { verifyAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  verifyAuth(),
  async function deleteOrderV1Controller(req, res) {
    try {
      const { id } = req.params;
      const customerId = req.id;

      const order = await Order.findById(id);
      if (!order) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Order not found", null, res);
      }

      if (order.deleted_at) {
        return response.send(0, STATUS_CODE.BAD_REQUEST, "Order is already deleted", null, res);
      }

      order.deleted_at = new Date();
      order.deleted_by = customerId;
      await order.save();

      return response.send(1, STATUS_CODE.OK, "Order deleted successfully", { id: order._id, deletedBy: customerId }, res);
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't delete order", null, res, error);
    }
  },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * /v1/order/delete/{id}:
 *   delete:
 *     tags:
 *       - Order
 *     summary: Soft delete an order by ID
 *     description: Marks an order as deleted by setting a deleted_at timestamp.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to be deleted.
 *     responses:
 *       200:
 *         description: Order successfully soft deleted.
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
 *                   example: "Order deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *       400:
 *         description: Bad request, order already deleted.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
