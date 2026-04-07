"use strict";

const { Joi } = require("@src/lib");
const { validate } = require("@src/middlewares");
const { Otp } = require("@src/models");
const { response } = require("@src/utils");
const jwt = require("jsonwebtoken");
const logger = require("@src/utils/logger");
const {
  ERROR,
  STATUS_CODE,
  OTP_PURPOSES,
} = require("@src/constants");

const SECRET_KEY = process.env.JWT_AUTH_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in the environment variables.");
}

const CONTROLLER = [
  validate({
    body: Joi.object()
      .keys({
        email: Joi.string().required(),
        otp: Joi.string().required(),
        token: Joi.string().required(),

      })
      .required(),
  }),
  async function verifyOtpController(req, res) {
    try {
      const { email, otp, token } = req.body;

      const otpRecord = await Otp.findOneAndDelete({
        identifier: email,
        code: otp,
        token: token,
        purpose: OTP_PURPOSES.FORGOT_PASSWORD
      });

      if (!otpRecord) {
        logger.warn(`Invalid OTP or expired for email: ${email}`);
        return response.send(
          0,
          STATUS_CODE.UNAUTHORIZED,
          "Invalid or expired OTP",
          null,
          res,
          ERROR.INVALID_OTP
        );
      }
     
      logger.info(`OTP verified successfully for email: ${email}`);
      return response.send(
        1,
        STATUS_CODE.OK,
        "OTP verified successfully",
        null,
        res,
        null
      );
    } catch (error) {
      logger.error(`Exception while verifying OTP: ${error.message}`, {
        message: error.message,
        stack: error.stack,
        errorObject: error,
        endpoint: "/v1/auth/customer/check-otp",
        method: "POST",
      });

      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't verify OTP",
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
 * tags:
 *   name: Forget Password
 *   description: APIs for OTP verification
 */

/**
 * @swagger
 * /auth/forgot-password/check-otp:
 *   post:
 *     tags: [Forget Password]
 *     summary: Verify the OTP for password reset
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
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               token:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
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
 *                   example: OTP verified successfully
 *       401:
 *         description: Invalid or expired OTP
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
 *                   example: Invalid or expired OTP
 *                 error:
 *                   type: string
 *                   example: INVALID_OTP
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
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Error message
 */
