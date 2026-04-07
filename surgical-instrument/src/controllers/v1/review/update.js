"use strict";

const { Review } = require("@src/models");
const { verifyAuth, validate } = require("@src/middlewares");
const { STATUS_CODE, REVIEW_STATUS } = require("@src/constants");
const { response } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  verifyAuth(),
  validate({
    body: Joi.object().keys({
      title: Joi.string().optional().trim(),
      description: Joi.string().optional().trim(),
      rating: Joi.number().integer().min(1).max(5).optional(),
    }),
  }),
  async function updateReviewV1Controller(req, res) {
    try {
      const { id } = req.params;
      const { title, description, rating } = req.body;
      const customer_id = req.id;

      // Find review by ID and customer_id
      const review = await Review.findOne({ _id: id, customer_id });
      if (!review) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Review not found", null, res);
      }

      if (title) review.title = title;
      if (description) review.description = description;
      if (rating) review.rating = rating;
      review.status = REVIEW_STATUS.PENDING;
      review.updated_at = new Date();

      await review.save();

      return response.send(1, STATUS_CODE.OK, "Review updated successfully", review, res);
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't update review", null, res, error);
    }
  },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * /v1/review/update/{id}:
 *   put:
 *     tags: [Review]
 *     summary: Update an existing product review
 *     description: Allows customers to update their product review. The review status will always be set to "PENDING" until it is accepted or rejected.
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
 *               title:
 *                 type: string
 *                 example: "Updated Review Title"
 *               description:
 *                 type: string
 *                 example: "Updated review description."
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *     responses:
 *       '200':
 *         description: Review updated successfully. The review status is automatically set to "PENDING".
 *       '400':
 *         description: Bad request due to validation errors.
 *       '404':
 *         description: Review not found.
 *       '500':
 *         description: Internal server error.
 */
