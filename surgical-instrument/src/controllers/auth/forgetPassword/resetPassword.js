"use strict";

const { Joi } = require("@src/lib");
const { validate } = require("@src/middlewares");
const { Otp, User,Customer } = require("@src/models");
const { response } = require("@src/utils");
const bcrypt = require("bcrypt");
const {
  ERROR,
  STATUS_CODE,
} = require("@src/constants");

const CONTROLLER = [
  validate({
    body: Joi.object()
      .keys({
        email: Joi.string().email().required(),
        newPassword: Joi.string().min(6).required(),
        confirmPassword: Joi.string().min(6).required(),
      })
      .required(),
  }),
  async function resetPasswordController(req, res) {
    try {
      const { email, newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword) {
        return response.send(
          0,
          STATUS_CODE.BAD_REQUEST,
          "New password and confirm password do not match",
          null,
          res,
          ERROR.PASSWORD_MISMATCH
        );
      }


      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const user = await Customer.findOneAndUpdate(
        { email: email },
        { password: hashedPassword },
        { new: true }
      );

      if (!user) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "User not found",
          null,
          res,
          ERROR.USER_NOT_FOUND
        );
      }

      return response.send(
        1,
        STATUS_CODE.OK,
        "Password updated successfully",
        null,
        res,
        null
      );
    } catch (error) {
      console.log("🚀 ~ resetPasswordController ~ error:", error)
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't reset password",
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
 *   description: APIs for password reset
 */

/**
 * @swagger
 * /auth/forgot-password/reset-password:
 *   post:
 *     tags: [Forget Password]
 *     summary: Reset password using new and confirm passwords
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
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewStrongPassword123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewStrongPassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully
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
 *                   example: Password updated successfully
 *       400:
 *         description: Password mismatch
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
 *                   example: New password and confirm password do not match
 *       404:
 *         description: User not found
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
 *                   example: User not found
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
