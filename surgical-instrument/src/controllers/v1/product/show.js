"use strict";

const { NewsEvent } = require("@src/models");
const { verifyAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  verifyAuth(),
  async function getFeaturedNewsEventV1Controller(req, res) {
    try {
      const featuredNews = await NewsEvent.find({
        is_featured: true,
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      }).sort({ date: -1 });

      return response.send(
        1,
        STATUS_CODE.OK,
        "Featured news and events fetched successfully",
        featuredNews,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch featured news and events",
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
 * /v1/news-event/getAll:
 *   get:
 *     tags: [News & Events]
 *     summary: Get all News & Events
 *     description: Fetches all news and events that are not soft deleted, sorted by title.
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
 *                         example: "65fe9e30f2b9a9b5d1f6b123"
 *                       title:
 *                         type: string
 *                         example: "Grand Opening Ceremony"
 *                       description:
 *                         type: string
 *                         example: "Join us for the launch of our new facility."
 *                       category:
 *                         type: string
 *                         enum: [products, events, posts]
 *                         example: "events"
 *                       image:
 *                         type: string
 *                         example: "https://example.com/path/to/image.jpg"
 *                       is_featured:
 *                         type: boolean
 *                         example: true
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-15T00:00:00.000Z"
 *                       created_by:
 *                         type: string
 *                         example: "adminId123"
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
