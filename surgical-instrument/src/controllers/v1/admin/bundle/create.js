"use strict";

const { Bundle } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { STATUS_CODE, S3_UPLOAD_FOLDER, S3_ACL } = require("@src/constants");
const { response, getFileInfoFromBase64 } = require("@src/utils");
const { Joi, S3 } = require("@src/lib");
const { S3_ENDPOINT, S3_BUCKET } = require("@src/config");

const CONTROLLER = [
VerifyAdminAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      image: Joi.string().required(),
      pack_size: Joi.number().min(1).required(),
      items: Joi.array().items(
        Joi.object().keys({
          product_id: Joi.string().required(),
        })
      ).min(1).required(),
    //   price: Joi.number().min(0).optional(),
      display_order: Joi.number().min(0).optional(),
      is_featured: Joi.boolean().optional(),
    }),
  }),
  async function createBundleAdminV1Controller(req, res) {
    try {
      const { name, image, pack_size, items, display_order, is_featured } = req.body;
      const { user } = req;
      
      // Handle image upload to S3
      let imageUrl = "";
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

      const newBundle = await Bundle.create({
        name,
        image: imageUrl,
        pack_size,
        items,
        // price: price || 0,
        display_order: display_order || 0,
        is_featured: is_featured || false,
        created_by: user.id,
      });

      return response.send(
        1,
        STATUS_CODE.OK,
        "Bundle created successfully",
        { newBundle },
        res
      );
    } catch (error) {
      console.error(error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't create bundle",
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
 * /v1/admin/bundle/create:
 *   post:
 *     tags: [Admin Bundle]
 *     summary: Create a new bundle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Holiday Special Bundle"
 *               image:
 *                 type: string
 *                 format: base64
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *               pack_size:
 *                 type: number
 *                 example: 3
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       example: "60d21b467c213e0017e6e31d"
 *               display_order:
 *                 type: number
 *                 example: 1
 *               is_featured:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Bundle created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
