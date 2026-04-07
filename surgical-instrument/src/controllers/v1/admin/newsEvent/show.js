"use strict";

const { NewsEvent } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  VerifyAdminAuth(),
  validate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  async function showNewsEventV1Controller(req, res) {
    try {
      const { id } = req.params;

      const newsEvent = await NewsEvent.findOne({
        _id: id,
        deleted_at: null,
      }).lean();

      if (!newsEvent) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "News or event not found", null, res);
      }

      return response.send(1, STATUS_CODE.OK, "News or event fetched successfully", { newsEvent }, res);
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch news or event",
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
 * /v1/admin/news-event/show/{id}:
 *   get:
 *     tags: [Admin News & Events]
 *     summary: Get a specific news or event by ID
 *     description: Fetch a single news or event document using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the news or event to fetch
 *         schema:
 *           type: string
 *           example: "65f3e8b8a1d4e6c1d7e0a2f9"
 *     responses:
 *       '200':
 *         description: News or event fetched successfully
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
 *                   example: "News or event fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     newsEvent:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "65f3e8b8a1d4e6c1d7e0a2f9"
 *                         title:
 *                           type: string
 *                           example: "Tech Launch 2025"
 *                         description:
 *                           type: string
 *                           example: "Exciting new product launch!"
 *                         category:
 *                           type: string
 *                           example: "events"
 *                         image:
 *                           type: string
 *                           example: "https://bucket.s3.amazonaws.com/news-events/image.jpg"
 *                         is_featured:
 *                           type: boolean
 *                           example: true
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-04-11T00:00:00.000Z"
 *                         created_by:
 *                           type: string
 *                           example: "adminId123"
 *       '404':
 *         description: News or event not found
 *       '500':
 *         description: Internal server error
 */
