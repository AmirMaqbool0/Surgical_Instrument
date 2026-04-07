"use strict";

const { NewsEvent } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  VerifyAdminAuth(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  validate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  async function deleteNewsEventV1Controller(req, res) {
    try {
      const { id } = req.params;
      const { user } = req;

      const newsEvent = await NewsEvent.findById(id);
      if (!newsEvent) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "News or event not found",
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
        "News or event deleted successfully",
        { id },
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't delete news or event",
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
 * /v1/admin/news-event/delete/{id}:
 *   delete:
 *     tags: [Admin News & Events]
 *     summary: Soft delete a news or event
 *     description: Marks a news or event entry as deleted by setting `deleted_at` and `deleted_by` fields.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the news or event to delete
 *         schema:
 *           type: string
 *           example: "65f3e8b8a1d4e6c1d7e0a2f9"
 *     responses:
 *       '200':
 *         description: News or event deleted successfully
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
 *                   example: "News or event deleted successfully"
 *       '404':
 *         description: News or event not found
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
 *                   example: "News or event not found"
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
