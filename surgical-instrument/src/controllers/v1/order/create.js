"use strict";

const { Order, Customer } = require("@src/models");
const { verifyAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { STATUS_CODE } = require("@src/constants");
const { response, generateUniqueOrderNumber } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  verifyAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi.object().keys({
      personal_info: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip_code: Joi.string().optional(),
        country: Joi.string().required(),
        notes: Joi.string().optional(),
      }),
      cart_info: Joi.array().items(
        Joi.object().keys({
          product_id: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
          price: Joi.number().min(0).required(),
        })
      ).required(),
      currency: Joi.string().required(),
      amount: Joi.number().min(0).required(),
      discount_amount: Joi.number().min(0).optional(),
      delivery_charges: Joi.number().min(0).optional(),
      payment_info: Joi.object().keys({
        mode: Joi.string().valid("stripe","paypal","cod").required(),
        status: Joi.string().valid("pending", "success", "failed", "refunded"),
        platform: Joi.string().optional(),
      }),
      delivery_info: Joi.object().keys({
        status: Joi.string().valid("pending", "in_progress", "delivered", "cancelled").optional(),
        delivery_date: Joi.date().optional(),
        delivery_charges: Joi.number().min(0).optional(),
        delivery_address: Joi.string().optional(),
      }).optional(),
    }),
  }),
  async function createOrderV1Controller(req, res) {
    try {
      const body = req.body;
      const { id } = req;

      const order_number = await generateUniqueOrderNumber();
      const newOrder = await Order.create({
        ...body,
        customer_id: id,
        order_number,
        created_by: id,
      });

      return response.send(1, STATUS_CODE.OK, "Order created successfully", { newOrder }, res);
    } catch (error) {
      console.error(error);
      return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't create order", null, res, error);
    }
  },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * /v1/order/create:
 *   post:
 *     tags: [Order]
 *     summary: Create a new order
 *     description: Creates a new order. The authenticated user is used as the customer. The order number is auto-generated.
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
 *                     example: "John"
 *                   last_name:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *                   address:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "Springfield"
 *                   state:
 *                     type: string
 *                     example: "Illinois"
 *                   zip_code:
 *                     type: string
 *                     example: "62704"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *                   notes:
 *                     type: string
 *                     example: "Please leave the package at the front door."
 *               cart_info:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       example: "660fb7a2fc13ae001f75b671"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 49.99
 *               delivery_address:
 *                 type: string
 *                 example: "123 Main St, Springfield"
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               amount:
 *                 type: number
 *                 example: 99.98
 *               discount_amount:
 *                 type: number
 *                 example: 10.00
 *               delivery_charges:
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
 *                     example: "delivered"
 *                   delivery_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-01T14:30:00Z"
 *                   delivery_charges:
 *                     type: number
 *                     example: 5.00
 *                   delivery_address:
 *                     type: string
 *                     example: "123 Main St, Springfield"
 *     responses:
 *       200:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
