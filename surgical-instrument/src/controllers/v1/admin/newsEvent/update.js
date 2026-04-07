"use strict";

const { NewsEvent } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const {
  STATUS_CODE,
  NEWS_EVENT_CATEGORY,
  S3_UPLOAD_FOLDER,
  S3_ACL,
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
      title: Joi.string().optional(),
      description: Joi.string().optional().max(500),
      category: Joi.string()
        .valid(...Object.values(NEWS_EVENT_CATEGORY))
        .optional(),
      image: Joi.string().optional().allow(""),
      is_featured: Joi.boolean().required(),
    }),
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  async function updateNewsEventV1Controller(req, res) {
    try {
      const {
        body: { title, description, category, image, is_featured },
        params: { id },
        user,
      } = req;

      let imageUrl = "";
      if (image?.length > 0) {
        const fileInfo = getFileInfoFromBase64(image);
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const { fileExtension, mimeType } = fileInfo;

        const folder = S3_UPLOAD_FOLDER.NEWS_EVENT;
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

      const updatedNewsEvent = await NewsEvent.findByIdAndUpdate(
        id,
        {
          ...(title && { title }),
          ...(description && { description }),
          ...(category && { category }),
          ...(imageUrl.length > 0 && { image: imageUrl }),
          ...(typeof is_featured === "boolean" && { is_featured }),
          updated_by: user.id,
        },
        { new: true }
      );

      if (!updatedNewsEvent) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "News or event not found",
          null,
          res
        );
      }

      return response.send(
        1,
        STATUS_CODE.OK,
        "News or event updated successfully",
        { updatedNewsEvent },
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      if (error instanceof S3Error) {
        response.send(
          0,
          error.status_code,
          "Couldn't update news or event",
          null,
          res,
          error.details
        );
      } else {
        response.send(
          0,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          "Couldn't update news or event",
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
 *   name: News & Events
 *   description: APIs for managing news and events
 */

/**
 * @swagger
 * /v1/admin/news-event/update/{id}:
 *   put:
 *     tags: [Admin News & Events]
 *     summary: Update an existing news or event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the news or event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Event Title"
 *               description:
 *                 type: string
 *                 example: "Updated description of the event."
 *               category:
 *                 type: string
 *                 enum: [products, events, posts]
 *                 example: "events"
 *               image:
 *                 type: string
 *                 format: base64
 *                 example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
 *               is_featured:
 *                 type: boolean
 *                 example: true
 *              
 *     responses:
 *       200:
 *         description: News or event updated successfully
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
 *                   example: "News or event updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedNewsEvent:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                           example: "Updated Event Title"
 *                         description:
 *                           type: string
 *                           example: "Updated description of the event."
 *                         category:
 *                           type: string
 *                           example: "events"
 *                         image:
 *                           type: string
 *                           example: "https://cdn.yourdomain.com/bucket/news-event/123.jpg"
 *                         updated_by:
 *                           type: string
 *                           example: "adminId123"
 *       400:
 *         description: Validation error
 *       404:
 *         description: News or event not found
 *       500:
 *         description: Internal server error
 */
