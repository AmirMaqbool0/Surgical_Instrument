"use strict";

const { NewsEvent } = require("@src/models");
const { VerifyAdminAuth } = require("@src/middlewares");
const {
  STATUS_CODE,
} = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  VerifyAdminAuth(),
  async function deleteNewsEventV1Controller(req, res) {
    try {
      const { id } = req.params;
      const { user } = req;

      const newsEvent = await NewsEvent.findOne({
        _id: id,
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }]
      });

      if (!newsEvent) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "News/Event not found or already deleted",
          null,
          res
        );
      }

      if (newsEvent.deleted_at) {
        return response.send(
          0,
          STATUS_CODE.BAD_REQUEST,
          "News/Event is already deleted",
          null,
          res
        );
      }

      newsEvent.deleted_at = new Date();
      newsEvent.deleted_by = user.id;
      await newsEvent.save();

      return response.send(
        1,
        STATUS_CODE.OK,
        "News/Event deleted successfully",
        { title: newsEvent.title },
        res,
        null
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't delete News/Event",
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
 *   description: APIs for News and Events management
 */

/**
 * @swagger
 * /v1/admin/news-event/delete/{id}:
 *   delete:
 *     tags: [News & Events]
 *     summary: Soft delete a News or Event by ID
 *     description: Marks a news/event as deleted by setting a deleted_at timestamp.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the news/event to be deleted.
 *     responses:
 *       200:
 *         description: News/Event successfully soft deleted.
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
 *                   example: "News/Event deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Product Launch 2025"
 *       400:
 *         description: Bad request, news/event already deleted.
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
 *                   example: "News/Event is already deleted"
 *       404:
 *         description: News/Event not found.
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
 *                   example: "News/Event not found or already deleted"
 *       500:
 *         description: Internal server error.
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
 *                   example: "Couldn't delete News/Event"
 */
