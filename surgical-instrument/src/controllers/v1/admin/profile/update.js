"use strict";

const { User } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { STATUS_CODE,S3_UPLOAD_FOLDER } = require("@src/constants");
const { response, getFileInfoFromBase64 } = require("@src/utils");
const { Joi, S3 } = require("@src/lib");
const { S3_ENDPOINT, S3_BUCKET, S3_ACL } = require("@src/config");
const { S3Error } = require("@src/errors");

const CONTROLLER = [
  VerifyAdminAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi.object().keys({
      firstName: Joi.string().optional().trim(),
      lastName: Joi.string().optional().trim(),
      email: Joi.string().optional().email(),
      password: Joi.string().optional(),
      profile_pic: Joi.string().optional().allow("", null),
    }),
  }),
  async function updateAdminProfileV1Controller(req, res) {
    try {
      const adminId = req.user.id;
      const { firstName, lastName, email, password, profile_pic } = req.body;

      const admin = await User.findById(adminId);
      if (!admin) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Admin not found", null, res);
      }

      if (firstName) admin.firstName = firstName;
      if (lastName) admin.lastName = lastName;
      if (email) admin.email = email;
      if (password) admin.password = password;

      if (profile_pic?.length > 0) {
        const fileInfo = getFileInfoFromBase64(profile_pic);
        const base64Data = profile_pic.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const { fileExtension, mimeType } = fileInfo;
        const folder = S3_UPLOAD_FOLDER.PROFILE;
        const metadata = { user: adminId };

        const transformedBuffer = await S3.prepareForS3Upload(buffer);
        const filePath = await S3.upload(
          `${folder}/${adminId}`,
          fileExtension,
          mimeType,
          transformedBuffer,
          S3_ACL.PUBLIC,
          metadata
        );

        admin.profile_pic = `${S3_ENDPOINT}/${S3_BUCKET}/${filePath}`;
      }

      admin.updated_by = adminId;
      await admin.save();

      return response.send(1, STATUS_CODE.OK, "Admin profile updated successfully", { admin }, res);
    } catch (error) {
      console.error(error.message ?? error);
      if (error instanceof S3Error) {
        return response.send(0, error.status_code, "Couldn't update profile", null, res, error.details);
      }
      return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't update profile", null, res, error);
    }
  },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin profile management
 */

/**
 * @swagger
 * /v1/admin/profile/update/{id}:
 *   put:
 *     tags: [Admin Profile]
 *     summary: Update admin profile
 *     description: Allows the admin to update their profile details including name, email, password, and profile picture.
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
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecureP@ssword123"
 *               profile_pic:
 *                 type: string
 *                 format: base64
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *     responses:
 *       '200':
 *         description: Admin profile updated successfully
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
 *                   example: "Admin profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65fabc123abc456abc789abc"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     profile_pic:
 *                       type: string
 *                       example: "https://cdn.example.com/bucket/profile/adminid/image.jpg"
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Admin not found
 *       '500':
 *         description: Internal server error
 */
