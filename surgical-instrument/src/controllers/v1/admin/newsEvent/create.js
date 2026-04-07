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

const CONTROLLER = [
  VerifyAdminAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required().max(500),
      category: Joi.string()
        .valid(...Object.values(NEWS_EVENT_CATEGORY))
        .required(),
      image: Joi.string().required().allow(""),
      is_featured: Joi.boolean().required(),
    }),
  }),
  async function createNewsEventController(req, res) {
    try {
      const {
        body: { title, description, category, image, is_featured },
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

      const newNewsEvent = await NewsEvent.create({
        title,
        description,
        category,
        image: imageUrl?.length > 0 ? imageUrl : null,
        is_featured,
        created_by: user.id,
      });

      const data = { newNewsEvent };

      return response.send(1, STATUS_CODE.OK, "News/Event created successfully", data, res, null);
    } catch (error) {
      console.error(error.message ?? error);
      response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't create News/Event",
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
 * tags:
 *   name: News & Events
 *   description: APIs for managing news and events
 */

/**
 * @swagger
 * /v1/admin/news-event/create:
 *   post:
 *     tags: [Admin News & Events]
 *     summary: Create a new news or event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Grand Opening Ceremony"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "We're thrilled to announce the grand opening of our new branch."
 *               category:
 *                 type: string
 *                 enum: [products, events, posts]
 *                 example: "events"
 *               image:
 *                 type: string
 *                 format: base64
 *                 example: "data:image/jpeg;base64,/9j/4AAQSk..."
 *               is_featured:
 *                type: boolean
 *                example: true/false
 *                description: Whether the news/event is featured or not
 *     responses:
 *       '200':
 *         description: News/Event created successfully
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
 *                   example: "News/Event created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     newNewsEvent:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         category:
 *                           type: string
 *                         image:
 *                           type: string
 *                           format: uri
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-04-11T00:00:00.000Z"
 *                         created_by:
 *                           type: string
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Internal server error
 */
