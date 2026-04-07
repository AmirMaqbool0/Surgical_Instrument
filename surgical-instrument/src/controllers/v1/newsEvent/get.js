"use strict";

const { NewsEvent } = require("@src/models");
const { verifyAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  verifyAuth(),
  async function getAllNewsEventV1Controller(req, res) {
    try {
      const newsEvent = await NewsEvent.find({
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      }).sort({ name: 'asc' });

      return response.send(
        1,
        STATUS_CODE.OK,
        "All Active news and Event fetched successfully",
        newsEvent,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch News and Event",
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
 * /v1/news-event/get:
 *   get:
 *     tags: [News & Events]
 *     summary: Get all active news and events
 *     description: Fetches all news and event entries that are not soft-deleted.
 *     responses:
 *       '200':
 *         description: News & Events fetched successfully
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
 *                   example: "All Active news and Event fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "660aa1c4c2b46d9d98f14610"
 *                       title:
 *                         type: string
 *                         example: "New Product Launch"
 *                       description:
 *                         type: string
 *                         example: "We are excited to announce the launch of our latest surgical instruments."
 *                       category:
 *                         type: string
 *                         example: "products"
 *                       image:
 *                         type: string
 *                         format: uri
 *                         example: "https://s3.amazonaws.com/bucket/news-events/image.jpg"
 *                       is_featured:
 *                         type: boolean
 *                         example: true
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-05-01T00:00:00.000Z"
 *                       created_by:
 *                         type: string
 *                         example: "adminUserId123"
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
 *                   example: "Couldn't fetch News and Event"
 *                 error:
 *                   type: string
 *                   example: "Error details here"
 */
