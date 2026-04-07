"use strict";

const { Product, Manufacturer, InstrumentCategory } = require("@src/models");
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
const { S3_ENDPOINT, S3_BUCKET } = require("@src/config");
const { S3Error } = require("@src/errors");

const CONTROLLER = [
  VerifyAdminAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi.object().keys({
      name: Joi.string().optional(),
      short_desc: Joi.string().optional().max(500),
      long_desc: Joi.string().optional(),
      price: Joi.number().optional().min(0),
      manufacturer_id: Joi.string().required(),
      category_id: Joi.string().required(),
      quantity: Joi.number().optional().min(1),
      images: Joi.array().items(Joi.string()).required(),
    }),
  }),
  async function updateProductAdminV1Controller(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        short_desc,
        long_desc,
        price,
        manufacturer_id,
        category_id,
        quantity,
        images,
      } = req.body;
      const { user } = req;

      const product = await Product.findById(id);
      if (!product) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Product not found", null, res);
      }

      if (manufacturer_id) {
        const manufacturer = await Manufacturer.findById(manufacturer_id);
        if (!manufacturer) {
          return response.send(0, STATUS_CODE.NOT_FOUND, "Manufacturer not found", null, res);
        }
      }

      if (category_id) {
        const category = await InstrumentCategory.findById(category_id);
        if (!category) {
          return response.send(0, STATUS_CODE.NOT_FOUND, "Category not found", null, res);
        }
      }

      if (name) product.name = name;
      if (short_desc) product.short_desc = short_desc;
      if (long_desc) product.long_desc = long_desc;
      if (price) product.price = price;
      if (manufacturer_id) product.manufacturer_id = manufacturer_id;
      if (category_id) product.category_id = category_id;
      if (quantity) product.quantity = quantity;

      if (images && Array.isArray(images)) {
        const uploadedImageUrls = [];
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
        product.images = uploadedImageUrls;
      }
      console.log(product.images);

      product.updated_by = user.id;
      await product.save();

      return response.send(1, STATUS_CODE.OK, "Product updated successfully", { product }, res);
    } catch (error) {
      console.error(error);
      return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't update product", null, res, error);
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
 * /v1/admin/product/update/{id}:
 *   put:
 *     tags: [Admin Product]
 *     summary: Update an existing product
 *     description: Updates details of an existing product by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Surgical Scissors"
 *               short_desc:
 *                 type: string
 *                 example: "Updated high-quality stainless steel surgical scissors"
 *               long_desc:
 *                 type: string
 *                 example: "Updated design for precision cutting in medical applications."
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 59.99
 *               manufacturer_id:
 *                 type: string
 *                 example: "65f1d2c5b5e6a2b8a1d3b238"
 *               category_id:
 *                 type: string
 *                 example: "65f1d2c5b5e6a2b8a1d3b239"
 *               quantity:
 *                 type: integer
 *                 example: 150
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/newimage1.jpg", "https://example.com/newimage2.jpg"]
 *     responses:
 *       '200':
 *         description: Product updated successfully
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
 *                   example: "Product updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b238"
 *                     name:
 *                       type: string
 *                       example: "Updated Surgical Scissors"
 *                     short_desc:
 *                       type: string
 *                       example: "Updated high-quality stainless steel surgical scissors"
 *                     long_desc:
 *                       type: string
 *                       example: "Updated design for precision cutting in medical applications."
 *                     price:
 *                       type: number
 *                       example: 59.99
 *                     manufacturer_id:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b238"
 *                     category_id:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b239"
 *                     quantity:
 *                       type: integer
 *                       example: 150
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/newimage1.jpg", "https://example.com/newimage2.jpg"]
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
 *         description: Product not found
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
 *                   example: "Product not found"
 *       '500':
 *         description: Internal server error
 */

