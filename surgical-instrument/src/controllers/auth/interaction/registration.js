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
      firstName: Joi.string().required().messages({
        "any.required": "First name is required",
      }),
      lastName: Joi.string().required().messages({
        "any.required": "Last name is required",
      }),
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
      }),
      password: Joi.string().min(6).required().messages({
        "any.required": "Password is required",
      }),
      confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "any.required": "Confirm password should match",
      }),
    }),
  }),

  async function signupCustomerController(req, res) {
    try {
      const { firstName, lastName, email, password, confirmPassword } = req.body;

      // Check if the email is already in use
      const customerExists = await Customer.findOne({ email });
      if (customerExists) {
        return response.send(
          0,
          STATUS_CODE.BAD_REQUEST,
          "Email already in use",
          null,
          res,
          "Email already in use"
        );
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        return response.send(
          0,
          STATUS_CODE.BAD_REQUEST,
          "Password does not match",
          null,
          res,
          "Password does not match"
        );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new customer
      const newCustomer = new Customer({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await newCustomer.save();

      // Generate JWT token
      const token = jwt.sign(
        { customer_id: newCustomer._id, email: newCustomer.email },
        SECRET_KEY,
        { expiresIn: "30d" }
      );

      return response.send(
        1,
        STATUS_CODE.CREATED,
        "Customer registered successfully",
        { customer: newCustomer.serialize(), token },
        res
      );
    } catch (error) {
      console.error(error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "An error occurred during signup",
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
 * /auth/interaction/registration:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new customer
 *     description: Creates a new customer account with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "customer@example.com"
 *               password:
 *                 type: string
 *                 example: "customer123"
 *               confirmPassword:
 *                 type: string
 *                 example: "customer123"
 *     responses:
 *       201:
 *         description: Customer registered successfully
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
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Customer registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "65f1d2c5b5e6a2b8a1d3b238"
 *                         firstName:
 *                           type: string
 *                           example: "John"
 *                         lastName:
 *                           type: string
 *                           example: "Doe"
 *                         email:
 *                           type: string
 *                           example: "customer@example.com"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error or email already in use
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
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Email already in use"
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
 *                   example: "An error occurred during signup"
 */
