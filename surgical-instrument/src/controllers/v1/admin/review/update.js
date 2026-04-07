"use strict";

const { Review } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const { STATUS_CODE, REVIEW_STATUS } = require("@src/constants");
const { response } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  VerifyAdminAuth(),
  validate({
    body: Joi.object().keys({
      status: Joi.string()
        .valid(REVIEW_STATUS.APPROVED, REVIEW_STATUS.REJECTED)
        .required(),
    }),
  }),
  async function updateReviewStatusAdminV1Controller(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const review = await Review.findById(id);
      if (!review) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Review not found", null, res);
      }

      review.status = status;
      review.updated_at = Date.now();
      await review.save();

      return response.send(1, STATUS_CODE.OK, "Review status updated successfully", review, res);
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't update review status",
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
 * /v1/admin/review/update/{id}:
 *   put:
 *     tags: [Admin Review]
 *     summary: Update review status
 *     description: Allows an admin to approve or reject a review.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["approved", "rejected"]
 *                 example: "approved"
 *     responses:
 *       '200':
 *         description: Review status updated successfully
 *       '400':
 *         description: Bad request due to validation errors
 *       '404':
 *         description: Review not found
 *       '500':
 *         description: Internal server error
 */
