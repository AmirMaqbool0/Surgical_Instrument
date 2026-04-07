"use strict";

const { Review } = require("@src/models");
const { verifyAuth, validate } = require("@src/middlewares");
const { STATUS_CODE, REVIEW_STATUS } = require("@src/constants");
const { Joi } = require("@src/lib");
const { response } = require("@src/utils");
const { Types } = require("mongoose");

const CONTROLLER = [
  verifyAuth(),
  validate({
    body: Joi.object().keys({
      type_id: Joi.string().required(),
    }),
  }),
  async function getAllReviewsV1Controller(req, res) {
    try {
      const { type_id } = req.body;

      const ratingStats = await Review.aggregate([
        {
          $match: {
            type_id: new Types.ObjectId(type_id), status: REVIEW_STATUS.APPROVED,
            $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }]
          }
        },

        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
      ]);

      const ratingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let total = 0;
      let sum = 0;

      ratingStats.forEach((r) => {
        ratingCount[r._id] = r.count;
        total += r.count;
        sum += r._id * r.count;
      });

      const distribution = {};
      for (let i = 1; i <= 5; i++) {
        distribution[i] = total ? ((ratingCount[i] / total) * 100).toFixed(1) : "0.0";
      }

      const average = total ? (sum / total).toFixed(1) : "0.0";

      const approvedReviews = await Review.find({
        type_id,
        status: REVIEW_STATUS.APPROVED,
        deleted_at: null,
      })
        .sort({ rating: -1 })
        .populate({ path: "customer_id", select: "firstName lastName" });

      const formattedReviews = approvedReviews.map((review) => ({
        _id: review._id,
        title: review.title,
        description: review.description,
        rating: review.rating,
        type: review.type,
        type_id: review.type_id,
        customer_id: review?.customer_id._id,
        customer_name: `${review?.customer_id.firstName} ${review?.customer_id.lastName}`,
      }));

      return response.send(
        1,
        STATUS_CODE.OK,
        "Approved reviews with stats fetched successfully",
        {
          stats: {
            total_reviews: total,
            average_rating: average,
            rating_distribution: distribution,

          },
          reviews: formattedReviews,
        },
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch review stats",
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
 * /v1/review/get:
 *   post:
 *     tags: [Review]
 *     summary: Get review statistics and approved reviews
 *     description: Returns average rating, rating distribution, and all approved reviews for a product or service.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_id:
 *                 type: string
 *                 description: ID of the product or service
 *                 example: "65f1e8f9b6d7c3a5a1d3f456"
 *     responses:
 *       '200':
 *         description: Review stats fetched successfully
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
 *                   example: Approved reviews with stats fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_reviews:
 *                       type: integer
 *                       example: 50
 *                     average_rating:
 *                       type: string
 *                       example: "4.6"
 *                     rating_distribution:
 *                       type: object
 *                       properties:
 *                         1:
 *                           type: string
 *                           example: "2.0"
 *                         2:
 *                           type: string
 *                           example: "3.0"
 *                         3:
 *                           type: string
 *                           example: "10.0"
 *                         4:
 *                           type: string
 *                           example: "20.0"
 *                         5:
 *                           type: string
 *                           example: "65.0"
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6601e9ef3c95f62d2f8eaa99"
 *                           title:
 *                             type: string
 *                             example: "Amazing Product"
 *                           description:
 *                             type: string
 *                             example: "Works great!"
 *                           rating:
 *                             type: integer
 *                             example: 5
 *                           type:
 *                             type: string
 *                             example: "product"
 *                           type_id:
 *                             type: string
 *                             example: "65f1e8f9b6d7c3a5a1d3f456"
 *                           customer_id:
 *                             type: string
 *                             example: "65f1d2c5b5e6a2b8a1d3b238"
 *                           customer_name:
 *                             type: string
 *                             example: "John Doe"
 *       '401':
 *         description: Unauthorized - customer not logged in
 *       '500':
 *         description: Internal Server Error
 */
