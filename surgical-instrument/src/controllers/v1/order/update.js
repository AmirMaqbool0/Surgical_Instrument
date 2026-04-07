"use strict";

const { Order } = require("@src/models");
const { verifyAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  verifyAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      personal_info: Joi.object().keys({
        first_name: Joi.string().optional(),
        last_name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        phone: Joi.string().optional(),
        address: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        zip_code: Joi.string().optional(),
        country: Joi.string().optional(),
        notes: Joi.string().optional(),
      }).optional(),
      cart_info: Joi.array().items(
        Joi.object().keys({
          product_id: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
          price: Joi.number().min(0).required(),
        })
      ).optional(),
      currency: Joi.string().optional(),
      amount: Joi.number().min(0).optional(),
      discount_amount: Joi.number().min(0).optional(),
      payment_info: Joi.object().keys({
        mode: Joi.string().valid("stripe","paypal","cod").optional(),
        status: Joi.string().valid("pending", "success", "failed", "refunded").optional(),
        platform: Joi.string().optional(),
      }).optional(),
      delivery_info: Joi.object().keys({
        status: Joi.string().valid("pending", "in_progress", "delivered", "cancelled").optional(),
        delivery_date: Joi.date().optional(),
        delivery_charges: Joi.number().min(0).optional(),
        delivery_address: Joi.string().optional(),
      }).optional(),
      status: Joi.string().valid("created", "rejected", "confirmed", "shipped", "delivered", "cancelled").optional(),
    }),
  }),
  async function updateOrderV1Controller(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.id;

      const order = await Order.findOne({ _id: id, deleted_at: null });
      if (!order) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Order not found", null, res);
      }

      Object.assign(order, updates);
      order.updated_by = userId;
      await order.save();

      return response.send(1, STATUS_CODE.OK, "Order updated successfully", { order }, res);
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't update order",
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
 * /v1/order/update/{id}:
 *   put:
 *     tags: [Order]
 *     summary: Update an existing order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personal_info:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     example: "Jane"
 *                   last_name:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "jane@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+19876543210"
 *                   address:
 *                     type: string
 *                     example: "456 Elm St"
 *                   city:
 *                     type: string
 *                     example: "Metropolis"
 *                   state:
 *                     type: string
 *                     example: "New York"
 *                   zip_code:
 *                     type: string
 *                     example: "10001"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *                   notes:
 *                     type: string
 *                     example: "Deliver before 5 PM"
 *               cart_info:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       example: "660fb7a2fc13ae001f75b671"
 *                     quantity:
 *                       type: number
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 49.99
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               amount:
 *                 type: number
 *                 example: 49.99
 *               discount_amount:
 *                 type: number
 *                 example: 5.00
 *               payment_info:
 *                 type: object
 *                 properties:
 *                   mode:
 *                     type: string
 *                     example: "stripe"
 *                   status:
 *                     type: string
 *                     enum: [pending, success, failed, refunded]
 *                     example: "success"
 *                   platform:
 *                     type: string
 *                     example: "web"
 *               delivery_info:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     enum: [pending, in_progress, delivered, cancelled]
 *                     example: "in_progress"
 *                   delivery_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-10T14:30:00Z"
 *                   delivery_charges:
 *                     type: number
 *                     example: 3.00
 *                   delivery_address:
 *                     type: string
 *                     example: "456 Elm St, Metropolis"
 *               status:
 *                 type: string
 *                 enum: [created, rejected, confirmed, shipped, delivered, cancelled]
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
