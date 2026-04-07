"use strict";

const { Manufacturer} = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const {
  STATUS_CODE,
  RESPONSE_ACTION,
  LOG_TYPE,
  HTTP_VERBS,
  S3_UPLOAD_FOLDER,
  S3_ACL,
} = require("@src/constants");
const {
  response,
  getFileInfoFromBase64,
  insertMessageLog,
} = require("@src/utils");
const { Joi, S3 } = require("@src/lib");
const { S3_ENDPOINT,S3_CDN_URL, S3_BUCKET } = require("@src/config");
const { S3Error } = require("@src/errors");

const CONTROLLER = [
  VerifyAdminAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required().max(500),
      logo: Joi.string().required().allow(""),
      currency: Joi.string().required(),
      country: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
      area: Joi.string().required(),
      delivery_charges: Joi.number().optional().min(0),
    }),
  }),
  async function createManufacturerAdminV1Controller(req, res) {
    try {
      const {
        body: { name, description, logo, currency, country, state, city, area, delivery_charges },
        user,
      } = req;

      let logoUrl = "";
      if (logo?.length > 0) {
        const fileInfo = getFileInfoFromBase64(logo);
        const base64Data = logo.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const { fileExtension, mimeType } = fileInfo;

        const folder = S3_UPLOAD_FOLDER.MANUFACTURER;
        const metadata = { user: user.id };

        const transformedBuffer = await S3.prepareForS3Upload(buffer);
        const filePath = await S3.upload(
          `${folder}/${user.id}`,
          fileExtension,
          mimeType,
          transformedBuffer,
          S3_ACL.PUBLIC,
          metadata
        );

        logoUrl = `${S3_ENDPOINT}/${S3_BUCKET}/${filePath}`;
      }

      const newManufacturer = await Manufacturer.create({
        name,
        description,
        logo: logoUrl?.length > 0 ? logoUrl : null,
        currency,
        country,
        state,
        city,
        area,
        delivery_charges: delivery_charges || 0,
        created_by: user.id,
      });

      const data = { newManufacturer };
      return response.send(1, STATUS_CODE.OK, "Manufacturer created successfully", data, res, null);
    } catch (error) {
      console.error(error.message ?? error);
      if (error instanceof S3Error) {
        response.send(0, error.status_code, "Couldn't create manufacturer", null, res, error.details);
      } else {
        response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't create manufacturer", null, res, error);
      }
    }
  },
];

module.exports = CONTROLLER;


/**
 * @swagger
 * tags:
 *   name: Manufacturer
 *   description: APIs for manufacturer operations
 */

/**
 * @swagger
 * /v1/admin/manufacturer/create:
 *   post:
 *     tags: [Admin Manufacturer]
 *     summary: Create a new manufacturer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Yamaha"
 *               description:
 *                 type: string
 *                 example: "A top manufacturer of musical instruments."
 *                 maxLength: 500
 *               logo:
 *                 type: string
 *                 format: base64
 *                 description: Base64 encoded image data (optional)
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               country:
 *                 type: string
 *             
 *                 example: "65f1d2c5b5e6a2b8a1d3b234"
 *               state:
 *                 type: string
 *                 format: uuid
 *                 example: "65f1d2c5b5e6a2b8a1d3b235"
 *               city:
 *                 type: string
 *                 format: uuid
 *                 example: "65f1d2c5b5e6a2b8a1d3b236"
 *               area:
 *                 type: string
 *                 format: uuid
 *                 example: "65f1d2c5b5e6a2b8a1d3b237"
 *               delivery_charges:
 *                 type: number
 *                 format: float
 *                 example: 10.5
 *     responses:
 *       '200':
 *         description: Manufacturer created successfully
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
 *                   example: "Manufacturer created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b238"
 *                     name:
 *                       type: string
 *                       example: "Yamaha"
 *                     description:
 *                       type: string
 *                       example: "A top manufacturer of musical instruments."
 *                     logo:
 *                       type: string
 *                       example: "https://s3.bucket.com/manufacturer/logo.png"
 *                     currency:
 *                       type: string
 *                       example: "USD"
 *                     country:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b234"
 *                     state:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b235"
 *                     city:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b236"
 *                     area:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b237"
 *                     delivery_charges:
 *                       type: number
 *                       format: float
 *                       example: 10.5
 *       '400':
 *         description: Bad request due to validation errors
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
 *                   example: "Validation error"
 *                 error:
 *                   type: object
 *                   properties:
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           message:
 *                             type: string
 *                             example: "Validation failed for field 'name'"
 *                           path:
 *                             type: array
 *                             items:
 *                               type: string
 *                               example: ["name"]
 *       '401':
 *         description: Unauthorized access
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
 *                   example: "Unauthorized"
 *       '500':
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
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Error details here"
 */
