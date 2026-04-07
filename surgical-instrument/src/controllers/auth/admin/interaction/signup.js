"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("@src/models");
const { validate } = require("@src/middlewares");
const { Joi } = require("@src/lib");
const { response, insertMessageLog } = require("@src/utils");
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
        "any.required": "email is required",
      }),
      password: Joi.string().min(6).required().messages({
        "any.required": "password is required",
      }),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        "any.required": "confirm password should match",
      }),
      //   phone_number: Joi.object().keys({
      //     code: Joi.string().required(),
      //     number: Joi.string().required(),
      //   }).required(),
    }),
  }),

  async function signupInteraction(req, res) {
    try {
      const { firstName, lastName, email, password, confirmPassword} = req.body;

      const userExists = await User.findOne({ email });

      //   const userExists = await User.findOne({
      //     $or: [{ email }, { "phone_number.number": phone_number.number }],
      //   });

      if (userExists) {
        return response.send(
          0,
          STATUS_CODE.BAD_REQUEST,
          "Email already in use",
          null,
          res,
          "Email already in use"
        );
      }
      if(password !== confirmPassword){
        return response.send(
          0,
          STATUS_CODE.BAD_REQUEST,
          "Password does not match",
          null,
          res,
          "Password does not match"
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        // phone_number,
      });
      
      await newUser.save();

      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        SECRET_KEY,
        { expiresIn: "30d" }
      );

      return response.send(
        1,
        STATUS_CODE.CREATED,
        "User registered successfully",
        { user: newUser.serialize(), token },
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
 * /auth/admin/interaction/signup:
 *   post:
 *     tags: [Admin User Authentication]
 *     summary: Register a new user
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
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "64a7f0b6c5f84e5d12345678"
 *                         firstName:
 *                           type: string
 *                           example: "John"
 *                         lastName:
 *                           type: string
 *                           example: "Doe"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
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
 *                 message:
 *                   type: string
 *                   example: Email or phone number already in use
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
 *                 message:
 *                   type: string
 *                   example: Couldn't register user
 */
