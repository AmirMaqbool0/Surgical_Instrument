"use strict";

const { Customer } = require("@src/models");
const { verifyAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const {
  STATUS_CODE,
  S3_UPLOAD_FOLDER,
  S3_ACL,
  CUSTOMER_GENDER,
  CUSTOMER_STATUS,
} = require("@src/constants");
const { response, getFileInfoFromBase64 } = require("@src/utils");
const { Joi, S3 } = require("@src/lib");
const { S3_ENDPOINT, S3_BUCKET } = require("@src/config");
const { S3Error } = require("@src/errors");

const CONTROLLER = [
  verifyAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi.object().keys({
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().optional(),
      profile_pic: Joi.string().optional().allow(""),
      gender: Joi.string().valid(...Object.values(CUSTOMER_GENDER)).optional(),
      date_of_birth: Joi.object().keys({
        date: Joi.number().optional(),
        month: Joi.number().optional(),
        year: Joi.number().optional(),
      }).optional(),
      phone_number: Joi.object().keys({
        code: Joi.string().optional(),
        number: Joi.string().optional(),
      }).optional(),
     
    })
  }),
  async function updateCustomerProfileV1Controller(req, res) {
    try {
      const customer_id = req.id;
      const updateData = req.body;

      const customer = await Customer.findById(customer_id);
      if (!customer) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Customer not found", null, res);
      }

      if (updateData.profile_pic?.length > 0) {
        const fileInfo = getFileInfoFromBase64(updateData.profile_pic);
        const base64Data = updateData.profile_pic.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const { fileExtension, mimeType } = fileInfo;

        const folder = S3_UPLOAD_FOLDER.CUSTOMER;
        const metadata = { user: customer_id };

        const transformedBuffer = await S3.prepareForS3Upload(buffer);
        const filePath = await S3.upload(
          `${folder}/${customer_id}`,
          fileExtension,
          mimeType,
          transformedBuffer,
          S3_ACL.PUBLIC,
          metadata
        );

        updateData.profile_pic = `${S3_ENDPOINT}/${S3_BUCKET}/${filePath}`;
      }

      Object.assign(customer, updateData);
      customer.updated_at = new Date();
      await customer.save();

      return response.send(1, STATUS_CODE.OK, "Customer profile updated successfully", customer, res);
    } catch (error) {
      console.error(error);
      if (error instanceof S3Error) {
        return response.send(0, error.status_code, "Couldn't update customer profile", null, res, error.details);
      } else {
        return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't update customer profile", null, res, error);
      }
    }
  },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: APIs for customer profile operations
 */

/**
 * @swagger
 * /v1/customer/update/{id}:
 *   put:
 *     tags: [Profile]
 *     summary: Update customer profile
 *     description: Allows customers to update their profile details such as name, profile picture, contact info, and preferences.
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
 *               profile_pic:
 *                 type: string
 *                 format: base64
 *                 description: Base64 encoded image string (optional)
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *               date_of_birth:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: integer
 *                     example: 15
 *                   month:
 *                     type: integer
 *                     example: 8
 *                   year:
 *                     type: integer
 *                     example: 1995
 *               gender:
 *                 type: string
 *                 enum: ["male", "female", "other"]
 *                 example: "male"
 *               country_code:
 *                 type: string
 *                 example: "+1"
 *               phone_number:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "+1"
 *                   number:
 *                     type: string
 *                     example: "9876543210"
 *             
 *     responses:
 *       '200':
 *         description: Customer profile updated successfully
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
 *                   example: "Customer profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65fe8adbc83f3e6cc5ad78f3"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     profile_pic:
 *                       type: string
 *                       example: "https://your-bucket.s3.amazonaws.com/customer/profile_pic.png"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     date_of_birth:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: integer
 *                           example: 15
 *                         month:
 *                           type: integer
 *                           example: 8
 *                         year:
 *                           type: integer
 *                           example: 1995
 *       '400':
 *         description: Bad request due to validation errors
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
