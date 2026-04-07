"use strict";

const { Manufacturer, SystemLocalization } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const {
  STATUS_CODE,
  S3_ACL,
  S3_UPLOAD_FOLDER,
  RESPONSE_ACTION,
  LOG_TYPE,
  HTTP_VERBS,
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
      description: Joi.string().required().max(255),
      logo: Joi.string().required().allow(""),
      currency: Joi.string().required(),
      country: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
      area: Joi.string().required(),
      delivery_charges: Joi.number().optional().min(0),
    }),
  }),
  async function updateManufacturerAdminV1Controller(req, res) {
    try {
      const {
        body: { name, description, logo, currency, country, state, city, area, delivery_charges },
        user,
        params: { id },
      } = req;

      const manufacturer = await Manufacturer.findById(id);
      if (!manufacturer) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "Manufacturer not found",
          null,
          res
        );
      }

      let logoUrl = manufacturer.logo;
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

      manufacturer.name = name;
      manufacturer.description = description;
      manufacturer.logo = logoUrl;
      manufacturer.currency = currency;
      manufacturer.country = country;
      manufacturer.state = state ;
      manufacturer.city = city ;
      manufacturer.area = area ;
      manufacturer.delivery_charges = delivery_charges ;
      manufacturer.updated_by = user.id;

      await manufacturer.save();

    
  

      return response.send(1, STATUS_CODE.OK, "Manufacturer Updated Successfully", manufacturer, res, null);
    } catch (error) {
      console.error(error.message ?? error);
      // insertMessageLog(
      //   LOG_TYPE.ERROR,
      //   `Exception while updating manufacturer: ${error?.message}`,
      //   {
      //     message: error?.message,
      //     stack: error?.stack,
      //     errorObject: error,
      //   },
      //   `/v1/admin/manufacturer/update`,
      //   HTTP_VERBS.PUT,
      //   req?.user?.id || null
      // );
      if (error instanceof S3Error) {
        response.send(
          0,
          error.status_code,
          "Couldn't update manufacturer",
          null,
          res,
          error.details
        );
      } else {
        response.send(
          0,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          "Couldn't update manufacturer",
          null,
          res,
          error
        );
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
 * /v1/admin/manufacturer/update/{id}:
 *   put:
 *     tags: [Admin Manufacturer]
 *     summary: Update an existing manufacturer
 *     description: Updates the details of an existing manufacturer by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manufacturer to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Manufacturer Name"
 *               description:
 *                 type: string
 *                 example: "Updated description of the manufacturer."
 *               logo:
 *                 type: string
 *                 format: base64
 *                 example: "data:image/jpeg;base64,/9j/4AAQSk..."
 *                 description: Base64 encoded image data (optional)
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               country:
 *                 type: string
 *                 example: "United States"
 *               state:
 *                 type: string
 *                 example: "California"
 *               city:
 *                 type: string
 *                 example: "Los Angeles"
 *               area:
 *                 type: string
 *                 example: "Downtown"
 *               delivery_charges:
 *                 type: number
 *                 format: float
 *                 example: 10.5
 *     responses:
 *       '200':
 *         description: Manufacturer updated successfully
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
 *                   example: "Manufacturer updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *              
*/