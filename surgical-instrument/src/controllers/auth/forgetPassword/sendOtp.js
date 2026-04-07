"use strict";

const { Joi } = require("@src/lib");
const { validate } = require("@src/middlewares");
const { Customer, Otp } = require("@src/models");
const bodyParser = require("body-parser");
const { response,
  
} = require("@src/utils");
const {
  ERROR,
  STATUS_CODE,
  OTP_PURPOSES,
  LOG_TYPE,
  HTTP_VERBS,
} = require("@src/constants");
const { OTP } = require("@src/services");
const jwt = require("jsonwebtoken");
const { nodeMailer } = require("@src/utils");
const SECRET_KEY = process.env.JWT_AUTH_SECRET;

const CONTROLLER = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().messages({
          "any.required": "email is required"
        }),
      })
      .required(),
  }),
  async function forgottenPasswordController(req, res) {
    try {
      const { email } = req.body;

      const customer = await Customer.findOne({
        email: email,
        deleted_at: { $exists: false },
      });

      if (!customer) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "Email not found",
          null,
          res,
          ERROR.EMAIL_NOT_FOUND
        );
      }

      const otp = OTP.otpGenerator();
      const payload = {
        email: email,
      };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "5m" });

      const deleteExistingOtp = await Otp.findOneAndDelete({
        identifier: email,
        purpose: OTP_PURPOSES.FORGOT_PASSWORD,
      });
      const newOtp = await Otp.create({
        code: otp,
        purpose: OTP_PURPOSES.FORGOT_PASSWORD,
        token: token,
        identifier: customer.email,
      });

      if (!newOtp) {
        return response.send(
          0,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          "Could not create OTP",
          null,
          res,
          null
        );
      }

      const data = {
        token,
      };
      await nodeMailer.sendEmail(
        email,
        "Password Reset OTP",
        `Your password reset OTP is: ${otp}. This OTP is valid for 5 minutes.`
      );
      return response.send(
        1,
        STATUS_CODE.OK,
        "Password reset OTP sent",
        data,
        res,
        null
      );

    }
    catch (error) {
      console.log("🚀 ~ forgottenPasswordController ~ error:", error)
      // insertMessageLog(
      //   LOG_TYPE.ERROR,
      //   `Exception while sending OTP: ${error?.message}`,
      //   {
      //     message: error?.message,
      //     stack: error?.stack,
      //     errorObject: error,
      //   },
      //   "/v1/auth/customer/forgot-password",
      //   HTTP_VERBS.POST,
      //   null
      // );
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't send OTP",
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
 *   description: APIs for customer to change password
 */

/**
 * @swagger
 * /auth/forgot-password/send-otp:
 *   post:
 *     tags: [Forget Password]
 *     summary: Initiate password reset process
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
 *     responses:
 *       200:
 *         description: OTP sent successfully
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
 *                   example: Password reset OTP sent
 *                 data:
 *                   type: object
 *                   properties:
 *                     otp:
 *                       type: string
 *                       example: "123456"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.OHYciR-2XH2R5qFwtsCHz9YYdX3w9nPHlQsQ4gqRvys"
 *       404:
 *         description: Email not found
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
 *                   example: Email not found
 *                 error:
 *                   type: string
 *                   example: EMAIL_NOT_FOUND
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
