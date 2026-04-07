"use strict";

const { InstrumentCategory, SystemLocalization } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const {
  STATUS_CODE,
  S3_ACL,
  S3_UPLOAD_FOLDER,
  RESPONSE_ACTION,
  LOG_TYPE,
  HTTP_VERBS,
  INSTRUMENT_CATEGORY_STATUS
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
      description: Joi.string().required().max(100),
      name: Joi.string().required(),
      image: Joi.string().required().allow("").allow(null),
      display_order: Joi.number().integer().min(0).optional(),
      status: Joi.string().valid(...Object.values(INSTRUMENT_CATEGORY_STATUS)).required(),
    }),
    params: Joi.object().keys({
      id: Joi.string().required()
    })
  }),
  async function updateInstrumentCategoryAdminV1Controller(req, res) {
    try {
      const {
        body: { description, name, status, image, display_order },
        params: { id },
        user,
      } = req;

      const category = await InstrumentCategory.findById(id);
      if (!category) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "Instrument category not found",
          null,
          res
        );
      }

      let imageUrl = category.image;
      if (image?.length > 0) {
        const fileInfo = getFileInfoFromBase64(image);
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const { fileExtension, mimeType } = fileInfo;

        const folder = S3_UPLOAD_FOLDER.INSTRUMENT_CATEGORY;
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

        imageUrl = `${S3_ENDPOINT}/${S3_BUCKET}/${filePath}`;
      }

      category.name = name;
      category.description = description;
      category.image = imageUrl;
      category.display_order = display_order;
      category.category_status = status;
      category.updated_by = user.id;

      await category.save();

      return response.send(1, STATUS_CODE.OK, 'Instrument category updated successfully', category, res, null);
    } catch (error) {
      console.error(error.message ?? error);
      if (error instanceof S3Error) {
        return response.send(
          0,
          error.status_code,
          "Couldn't update instrument category",
          null,
          res,
          error.details
        );
      } else {
        return response.send(
          0,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          "Couldn't update instrument category",
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
 *   name: Instrument Category
 *   description: APIs for instrument category operations
 */

/**
 * @swagger
 * /v1/admin/instrument-category/update/{id}:
 *   put:
 *     tags: [Admin Instrument Category]
 *     summary: Update an existing instrument category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the instrument category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Guitar"
 *               description:
 *                 type: string
 *                 example: "Updated description of the guitar category."
 *                 maxLength: 100
 *               image:
 *                 type: string
 *                 format: base64
 *                 description: Base64 encoded image data (optional)
 *               display_order:
 *                 type: integer
 *                 example: 2
 *               status:
 *                 type: string
 *                 enum: ["active", "inactive"]
 *                 example: "active"
 *     responses:
 *       '200':
 *         description: Instrument category updated successfully
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
 *                   example: "Instrument category updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Updated Guitar"
 *                     description:
 *                       type: string
 *                       example: "Updated description of the guitar category."
 *                     image:
 *                       type: string
 *                       example: "https://example.com/path/to/updated-image.jpg"
 *                     display_order:
 *                       type: integer
 *                       example: 2
 *                     status:
 *                       type: string
 *                       example: "active"
 *                     updated_by:
 *                       type: string
 *                       example: "adminId123"
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
 *       '404':
 *         description: Instrument category not found
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
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Instrument category not found"
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
