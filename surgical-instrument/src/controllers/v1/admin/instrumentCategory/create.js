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
} = require("@src/constants");
const {
  response,
  getFileInfoFromBase64,
  insertMessageLog,
} = require("@src/utils");
const { Joi, S3 } = require("@src/lib");
const { S3_ENDPOINT, S3_CDN_URL, S3_BUCKET } = require("@src/config");
const { S3Error } = require("@src/errors");



const CONTROLLER = [
  VerifyAdminAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required().max(100),
      image: Joi.string().required().allow(""),
      display_order: Joi.number().integer().min(0).optional(),
    }),
  }),
  async function createInstrumentCategoryAdminV1Controller(req, res) {
    try {
      const {
        body: { name,description,image, display_order },
        user, 
      } = req;

      let imageUrl = "";
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

      const newCategory = await InstrumentCategory.create({
        name,
        description,
        image: imageUrl?.length > 0 ? imageUrl : null,
        display_order: display_order || 0,
        created_by: user.id,
      });
      const data = { newCategory };
      // const sys_localization = await SystemLocalization.findOne({
      //   eid: user.default_language,
      //   key: `${user.default_language}_response_${RESPONSE_ACTION.INSTRUMENT_CATEGORY_CREATED}`,
      //   lang_id: user.default_language,
      // });

      // const responseMessage =
      //   user.default_language === req.default_language || !sys_localization
      //     ? "Instrument category created successfully"
      //     : sys_localization.value;

      return response.send(1, STATUS_CODE.OK, 'Instrument category created successfully', data, res, null);
    } catch (error) {
      console.error(error);
      // insertMessageLog(
      //   LOG_TYPE.ERROR,
      //   `Exception while creating an instrument category: ${error?.message}`,
      //   {
      //     message: error?.message,
      //     stack: error?.stack,
      //     errorObject: error,
      //   },
      //   `/v1/admin/instrumentCategory/create`,
      //   HTTP_VERBS.POST,
      //   req?.user?.id || null
      // );
      if (error instanceof S3Error) {
        return response.send(
          0,
          error.status_code,
          "Couldn't create instrument category",
          null,
          res,
          error.details
        );
      } else {
        return response.send(
          0,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          "Couldn't create instrument category",
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
 * /v1/admin/instrument-category/create:
 *   post:
 *     tags: [Admin Instrument Category]
 *     summary: Create a new instrument category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Guitar"
 *               description:
 *                 type: string
 *                 example: "A category for all types of guitars."
 *                 maxLength: 100
 *               image:
 *                 type: string
 *                 format: base64
 *                 description: Base64 encoded image data (optional)
 *                 example: "data:image/jpeg;base64,/9j/4AAQSk..."
 *               display_order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Instrument category created successfully
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
 *                   example: "Instrument category created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     newCategory:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Guitar"
 *                         description:
 *                           type: string
 *                           example: "A category for all types of guitars."
 *                         image:
 *                           type: string
 *                           example: "https://example.com/path/to/image.jpg"
 *                         display_order:
 *                           type: integer
 *                           example: 1
 *                         created_by:
 *                           type: string
 *                           example: "adminId123"
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
