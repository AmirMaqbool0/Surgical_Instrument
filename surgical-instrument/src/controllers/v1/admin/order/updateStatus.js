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
    body: Joi.object().keys({
      status: Joi.string().valid("created", "rejected", "confirmed", "shipped", "delivered", "cancelled").required(),
    }),
  }),
  async function updateOrderStatusV1Controller(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findOne({ _id: id, deleted_at: null });
      if (!order) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Order not found", null, res);
      }

      order.status = status;
      order.updated_by = req.id;
      await order.save();

      return response.send(1, STATUS_CODE.OK, "Order status updated successfully", { order }, res);
    } catch (error) {
      console.error(error);
      return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't update order status", null, res, error);
    }
  },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * /v1/admin/order/update/{id}:
 *   patch:
 *     tags: [Admin Order]
 *     summary: Update order status
 *     description: Admin can update the status of an order.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [created, confirmed, shipped, delivered, cancelled, rejected]
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
