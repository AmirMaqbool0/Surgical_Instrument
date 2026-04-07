"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Customer } = require("@src/models");
const { validate } = require("@src/middlewares");
const { Joi } = require("@src/lib");
const { response } = require("@src/utils");
const { STATUS_CODE } = require("@src/constants");

const SECRET_KEY = process.env.JWT_AUTH_SECRET;

const CONTROLLER = [
  validate({
    body: Joi.object().keys({
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
      }),
      password: Joi.string().required().messages({
        "any.required": "Password is required",
      }),
    }),
  }),

  async function loginCustomerController(req, res) {
    try {
      const { email, password } = req.body;

      
      const customer = await Customer.findOne({ email });
      if (!customer) {
        return response.send(
          0,
          STATUS_CODE.UNAUTHORIZED,
          "Invalid email or password",
          null,
          res,
          "Customer not found"
        );
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, customer.password);
      if (!isPasswordValid) {
        return response.send(
          0,
          STATUS_CODE.UNAUTHORIZED,
          "Invalid email or password",
          null,
          res,
          "Incorrect password"
        );
      }

      // Generate a new token
      const token = jwt.sign(
        { customer_id: customer._id, email: customer.email },
        SECRET_KEY,
        { expiresIn: "30d" }
      );

      // Save the token in the database
      customer.token = token;
      await customer.save();

      // Respond with customer data and token
      return response.send(
        1,
        STATUS_CODE.OK,
        "Login successful",
        { customer: customer.serialize(), token },
        res
      );
    } catch (error) {
      console.error(error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "An error occurred during login",
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
 * /auth/interaction/login:
 *   post:
 *     tags: [Authentication ]
 *     summary: Login
 *     description: Logs in a customer using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "customer@example.com"
 *               password:
 *                 type: string
 *                 example: "customer123"
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "65f1d2c5b5e6a2b8a1d3b238"
 *                         email:
 *                           type: string
 *                           example: "customer@example.com"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Invalid email or password
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
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *       500:
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
 *                   example: "An error occurred during login"
 */
