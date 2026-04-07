"use strict";

const { Product } = require("@src/models");
const { VerifyAdminAuth } = require("@src/middlewares");
const { STATUS_CODE, RESPONSE_ACTION, LOG_TYPE, HTTP_VERBS } = require("@src/constants");
const { response, insertMessageLog } = require("@src/utils");

const CONTROLLER = [
    VerifyAdminAuth(),
    async function deleteProductAdminV1Controller(req, res) {
        try {
            const { id } = req.params;
            const { user } = req;

            
            const product = await Product.findById(id);
            if (!product) {
                return response.send(0, STATUS_CODE.NOT_FOUND, "Product not found", null, res);
            }

            
            if (product.deleted_at) {
                return response.send(0, STATUS_CODE.BAD_REQUEST, "Product is already deleted", null, res);
            }

           
            product.deleted_at = new Date();
            product.deleted_by = user.id;
            await product.save();

            return response.send(1, STATUS_CODE.OK, "Product deleted successfully", { id: product._id }, res);
        } catch (error) {
            console.error(error.message ?? error);

            // insertMessageLog(
            //     LOG_TYPE.ERROR,
            //     `Exception while deleting a product: ${error?.message}`,
            //     {
            //         message: error?.message,
            //         stack: error?.stack,
            //         errorObject: error,
            //     },
            //     `/v1/admin/product/delete/${req.params.id}`,
            //     HTTP_VERBS.DELETE,
            //     req?.user?.id || null
            // );

            return response.send(0, STATUS_CODE.INTERNAL_SERVER_ERROR, "Couldn't delete product", null, res, error);
        }
    },
];

module.exports = CONTROLLER;

/**
 * @swagger
 * /v1/admin/product/delete/{id}:
 *   delete:
 *     tags: [Admin Product]
 *     summary: Soft delete a product by ID
 *     description: Marks a product as deleted by setting a `deleted_at` timestamp.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to be deleted.
 *     responses:
 *       200:
 *         description: Product successfully soft deleted.
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
 *                   example: "Product deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65f1d2c5b5e6a2b8a1d3b238"
 *       400:
 *         description: Bad request, product already deleted.
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
 *                   example: "Product is already deleted"
 *       404:
 *         description: Product not found.
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
 *                   example: "Product not found"
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
 *                   example: "Couldn't delete product"
 */
