"use strict";

const { Bundle } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const {
  STATUS_CODE,
  S3_ACL,
  S3_UPLOAD_FOLDER,
} = require("@src/constants");
const {
  response,
  getFileInfoFromBase64,
} = require("@src/utils");
const { Joi, S3 } = require("@src/lib");
const { S3_ENDPOINT, S3_BUCKET } = require("@src/config");
const { S3Error } = require("@src/errors");

const CONTROLLER = [
  VerifyAdminAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi.object().keys({
      name: Joi.string().optional(),
      image: Joi.string().optional(),
      pack_size: Joi.number().min(1).optional(),
      items: Joi.array().items(
        Joi.object().keys({
          product_id: Joi.string().required(),
        })
      ).optional(),
      display_order: Joi.number().min(0).optional(),
      is_featured: Joi.boolean().optional(),
    }),
    params: Joi.object().keys({
      id: Joi.string().required()
    })
  }),
  async function updateBundleAdminV1Controller(req, res) {
    try {
      const {
        body: { name, image, pack_size, items, display_order, is_featured },
        params: { id },
        user,
      } = req;

      const bundle = await Bundle.findById(id);
      if (!bundle) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "Bundle not found",
          null,
          res
        );
      }

      let imageUrl = bundle.image;
      if (image?.length > 0) {
        const fileInfo = getFileInfoFromBase64(image);
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const { fileExtension, mimeType } = fileInfo;

        const folder = S3_UPLOAD_FOLDER.BUNDLE;
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

      bundle.name = name ?? bundle.name;
      bundle.image = imageUrl;
      bundle.pack_size = pack_size ?? bundle.pack_size;
      bundle.items = items ?? bundle.items;
      bundle.display_order = display_order ?? bundle.display_order;
      bundle.is_featured = is_featured ?? bundle.is_featured;
      bundle.updated_by = user.id;

      await bundle.save();

      return response.send(1, STATUS_CODE.OK, 'Bundle updated successfully', { bundle }, res, null);
    } catch (error) {
      console.error(error.message ?? error);
      if (error instanceof S3Error) {
        return response.send(
          0,
          error.status_code,
          "Couldn't update bundle",
          null,
          res,
          error.details
        );
      } else {
        return response.send(
          0,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          "Couldn't update bundle",
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
 *   name: Bundle
 *   description: APIs for managing bundles
 */

/**
 * @swagger
 * /v1/admin/bundle/update/{id}:
 *   put:
 *     tags: [Admin Bundle]
 *     summary: Update an existing bundle
 *     description: Update an existing bundle's details, including name, image, pack size, items, display order, and featured status.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the bundle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Starter Kit"
 *               image:
 *                 type: string
 *                 format: base64
 *                 description: Base64 encoded image data (optional)
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANS..."
 *               pack_size:
 *                 type: integer
 *                 example: 5
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       example: "60d21b467c213e0017e6e31d"
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *               display_order:
 *                 type: integer
 *                 example: 1
 *               is_featured:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       '200':
 *         description: Bundle updated successfully
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
 *                   example: "Bundle updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Updated Starter Kit"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/path/to/image.jpg"
 *                     pack_size:
 *                       type: integer
 *                       example: 5
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: string
 *                             example: "60d21b467c213e0017e6e31d"
 *                           quantity:
 *                             type: integer
 *                             example: 1
 *                     display_order:
 *                       type: integer
 *                       example: 1
 *                     is_featured:
 *                       type: boolean
 *                       example: true
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
 *       '404':
 *         description: Bundle not found
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
 *                   example: "Bundle not found"
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
 */
