"use strict";

const { Product, Manufacturer, InstrumentCategory } = require("@src/models");
const { generateUniqueProductNumber } = require("@src/utils");
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
      short_desc: Joi.string().required().max(500),
      long_desc: Joi.string().required(),
      price: Joi.number().required().min(0),
      manufacturer_id: Joi.string().required(),
      category_id: Joi.string().required(),
      quantity: Joi.number().required().min(1),
      images: Joi.array().items(Joi.string()).required(),
    }),
  }),
  async function createProductAdminV1Controller(req, res) {
    try {
      const {
        body: { name, short_desc, long_desc, price, manufacturer_id, category_id, quantity, images },
        user,
      } = req;

      const manufacturer = await Manufacturer.findById(manufacturer_id).select("name");
      const category = await InstrumentCategory.findById(category_id).select("name");

      if (!manufacturer || !category) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Manufacturer or category not found", null, res);
      }

      const product_number = await generateUniqueProductNumber(manufacturer.name, category.name);

      let uploadedImageUrls = [];
      if (Array.isArray(images) && images.length > 0) {
        for (const image of images) {
          const fileInfo = getFileInfoFromBase64(image);
          const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          const { fileExtension, mimeType } = fileInfo;

          const folder = S3_UPLOAD_FOLDER.PRODUCT;
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

          uploadedImageUrls.push(`${S3_ENDPOINT}/${S3_BUCKET}/${filePath}`);
        }
        console.log("Uploaded image URLs:", uploadedImageUrls);
      }

      const newProduct = await Product.create({
        name,
        short_desc,
        long_desc,
        price,
        manufacturer_id,
        category_id,
        quantity,
        images: uploadedImageUrls,
        product_number,
        created_by: user.id,
      });

      return response.send(1, STATUS_CODE.OK, "Product created successfully", { newProduct }, res, null);
    } catch (error) {
      console.error(error);
      if (error instanceof S3Error) {
        return response.send(0, error.status_code, "Couldn't create product", null, res, error.details);
      } else {
        return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't create product", null, res, error);
      }
    }
  },
];

module.exports = CONTROLLER;


/**
 * @swagger
 * tags:
 *   name: Product
 *   description: APIs for product operations
 */

/**
 * @swagger
 * /v1/admin/product/create:
 *   post:
 *     tags: [Admin Product]
 *     summary: Create a new product
 *     description: Creates a new product associated with a manufacturer and category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Surgical Scissors"
 *               short_desc:
 *                 type: string
 *                 example: "High-quality stainless steel surgical scissors"
 *               long_desc:
 *                 type: string
 *                 example: "Designed for precision cutting in medical applications."
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 49.99
 *               manufacturer_id:
 *                 type: string
 *                 description: "ID of the manufacturer"
 *                 example: "65f1d2c5b5e6a2b8a1d3b238"
 *               category_id:
 *                 type: string
 *                 description: "ID of the category"
 *                 example: "65f1e8f9b6d7c3a5a1d3f456"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *     responses:
 *       '200':
 *         description: Product created successfully
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
 *                   example: "Product created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b238"
 *                     name:
 *                       type: string
 *                       example: "Surgical Scissors"
 *                     short_desc:
 *                       type: string
 *                       example: "High-quality stainless steel surgical scissors"
 *                     long_desc:
 *                       type: string
 *                       example: "Designed for precision cutting in medical applications."
 *                     price:
 *                       type: number
 *                       example: 49.99
 *                     manufacturer_id:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b238"
 *                     category_id:
 *                       type: string
 *                       example: "65f1e8f9b6d7c3a5a1d3f456"
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
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
 *       '404':
 *         description: Manufacturer or category not found
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
 *                   example: "Manufacturer or category not found"
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
