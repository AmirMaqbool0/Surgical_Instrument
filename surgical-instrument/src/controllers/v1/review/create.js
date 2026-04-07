"use strict";

const { Review, Product, Manufacturer } = require("@src/models");
const { verifyAuth, validate } = require("@src/middlewares");
const { STATUS_CODE, REVIEW_STATUS, REVIEW_TYPE } = require("@src/constants");
const { response } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  verifyAuth(),
  validate({
    body: Joi.object().keys({
      type: Joi.string().valid(...Object.values(REVIEW_TYPE)).required(),
      type_id: Joi.string().required(),
      title: Joi.string().required().trim().max(100).min(1),
      description: Joi.string().required().trim().max(500).min(10),
      rating: Joi.number().integer().min(1).max(5).required(),
    }),
  }),
  async function createReviewV1Controller(req, res) {
    try {
      const { type, type_id, title, description, rating } = req.body;
      const customer_id = req.id;

      // Ensure the referenced entity exists (Product or Surgical)
      let referencedEntity;
      if (type === REVIEW_TYPE.PRODUCT) {
        referencedEntity = await Product.findById(type_id);
      } 
      if (type === REVIEW_TYPE.MANUFACTURER) {
        referencedEntity = await Manufacturer.findById(type_id);
      }
      if (!referencedEntity) {
        return response.send(0, STATUS_CODE.NOT_FOUND, `${type} not found`, null, res);
      }

      // Create the review
      const review = new Review({
        type,
        type_id,
        customer_id,
        title,
        description,
        rating,
        status: REVIEW_STATUS.PENDING,
      });

      await review.save();

      return response.send(
        1,
        STATUS_CODE.CREATED,
        "Review submitted successfully. Awaiting approval.",
        review,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't submit review",
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
 *   description: APIs for managing product and surgical reviews
 */

/**
 * @swagger
 * /v1/review/create:
 *   post:
 *     tags: [Review]
 *     summary: Create a new review
 *     description: Allows customers to submit a review for a product or surgical item.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ["PRODUCT", "SURGICAL"]
 *                 example: "PRODUCT"
 *               type_id:
 *                 type: string
 *                 example: "65f1e8f9b6d7c3a5a1d3f456"
 *               title:
 *                 type: string
 *                 example: "Great Product!"
 *               description:
 *                 type: string
 *                 example: "The product was exactly as described, and the quality is excellent."
 *               rating:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       '201':
 *         description: Review submitted successfully. Awaiting approval.
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
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Review submitted successfully. Awaiting approval."
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "PRODUCT"
 *                     type_id:
 *                       type: string
 *                       example: "65f1e8f9b6d7c3a5a1d3f456"
 *                     customer_id:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b238"
 *                     title:
 *                       type: string
 *                       example: "Great Product!"
 *                     description:
 *                       type: string
 *                       example: "The product was exactly as described, and the quality is excellent."
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     status:
 *                       type: string
 *                       example: "pending"
 *       '400':
 *         description: Bad request due to validation errors
 *       '404':
 *         description: Related entity (Product/Surgical) not found
 *       '500':
 *         description: Internal server error
 */
