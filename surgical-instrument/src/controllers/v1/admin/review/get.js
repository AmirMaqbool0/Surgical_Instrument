"use strict";

const { Review } = require("@src/models");
const { VerifyAdminAuth } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");

const CONTROLLER = [
  VerifyAdminAuth(),
  async function getAllReviewsAdminV1Controller(req, res) {
    try {
      const reviews = await Review.find({});

      return response.send(
        1,
        STATUS_CODE.OK,
        "All reviews fetched successfully",
        reviews,
        res
      );
    } catch (error) {
      console.error(error.message ?? error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't fetch reviews",
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
 * /v1/admin/review/get-all:
 *   get:
 *     tags: [Admin Review]
 *     summary: Get all reviews
 *     description: Fetches all reviews regardless of their status.
 *     responses:
 *       '200':
 *         description: All reviews fetched successfully
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
 *                   example: "All reviews fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "65fe9e30f2b9a9b5d1f6b123"
 *                       title:
 *                         type: string
 *                         example: "Great product!"
 *                       description:
 *                         type: string
 *                         example: "I really liked using this product. Highly recommended!"
 *                       rating:
 *                         type: integer
 *                         example: 4
 *                       review_status:
 *                         type: string
 *                         example: "APPROVED"
 *                       customer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "65f1d2c5b5e6a2b8a1d3b230"
 *                           username:
 *                             type: string
 *                             example: "john_doe"
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "65f1e8f9b6d7c3a5a1d3f456"
 *                           name:
 *                             type: string
 *                             example: "Wireless Earbuds"
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
 *                   example: "Couldn't fetch reviews"
 *                 error:
 *                   type: string
 *                   example: "Error details here"
 */
