"use strict";

const { Product } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const { STATUS_CODE } = require("@src/constants");
const { response } = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  VerifyAdminAuth(),
  validate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      is_featured: Joi.boolean().required(),
    }),
  }),
  async function getFeaturedProductV1Controller(req, res) {
    try {
      const { id } = req.params;
      const { is_featured } = req.body;

      const product = await Product.findById(id);
      if (!product) {
        return response.send(0, STATUS_CODE.NOT_FOUND, "Product not found", null, res);
      }

      product.is_featured = is_featured;
      await product.save();

      return response.send(
        1,
        STATUS_CODE.OK,
        `Product has been ${is_featured ? "marked as featured" : "removed from featured"}`,
        product,
        res
      );
    } catch (error) {
      console.error(error);
      return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't update featured status", null, res, error);
    }
  },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * /v1/admin/product/featured/{id}:
 *   put:
 *     tags: [Admin Product]
 *     summary: Mark or unmark product as featured
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_featured:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Featured status updated
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
