"use strict";

const { Review } = require("@src/models");
const { VerifyAdminAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  VerifyAdminAuth(),
  async function deleteReviewAdminV1Controller(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findById(id);
      if (!review || review.deleted_at) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "Review not found or already deleted",
          null,
          res
        );
      }

      review.deleted_at = new Date();
      await review.save();

      return response.send(
        1,
        STATUS_CODE.OK,
        "Review deleted (soft) successfully",
        review,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't delete review",
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
 *   name: Review
 *   description: APIs for review management
 */

/**
 * @swagger
 * /v1/admin/review/delete/{id}:
 *   delete:
 *     tags: [Admin Review]
 *     summary: Soft delete a review
 *     description: Soft deletes a review by setting the `deleted_at` timestamp. Only accessible by admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review to soft delete
 *     responses:
 *       '200':
 *         description: Review soft deleted successfully
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
 *                   example: "Review deleted (soft) successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65fe9e30f2b9a9b5d1f6b123"
 *                     title:
 *                       type: string
 *                       example: "Great product!"
 *                     deleted_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-04T12:34:56.789Z"
 *       '404':
 *         description: Review not found or already deleted
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
 *                   example: "Review not found or already deleted"
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
 *                   example: "Couldn't delete review"
 *                 error:
 *                   type: string
 *                   example: "Error details here"
 */

