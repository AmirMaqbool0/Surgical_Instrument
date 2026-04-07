"use strict";

const { InstrumentCategory } = require("@src/models");
const { VerifyAdminAuth } = require("@src/middlewares");
const {
  STATUS_CODE,
  RESPONSE_ACTION,
  LOG_TYPE,
  HTTP_VERBS,
} = require("@src/constants");
const { response, insertMessageLog } = require("@src/utils");

const CONTROLLER = [
  VerifyAdminAuth(),
  async function deleteInstrumentCategoryAdminV1Controller(req, res) {
    try {
      const { id } = req.params;
      const { user } = req;

      const category = await InstrumentCategory.findOne({ _id: id, $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }] });

      if (!category) {
        return response.send(
          0,
          STATUS_CODE.NOT_FOUND,
          "Instrument category not found or already deleted",
          null,
          res
        );
      }

      category.deleted_at = new Date();
      category.deleted_by = user.id;
      await category.save();

      return response.send(
        1,
        STATUS_CODE.OK,
        "Instrument category deleted successfully",
        { name: category.name },
        res,
        null
      );
    } catch (error) {
      console.error(error.message ?? error);

      // insertMessageLog(
      //   LOG_TYPE.ERROR,
      //   `Exception while deleting an instrument category: ${error?.message}`,
      //   {
      //     message: error?.message,
      //     stack: error?.stack,
      //     errorObject: error,
      //   },
      //   `/v1/admin/instrumentCategory/delete/${req.params.id}`,
      //   HTTP_VERBS.DELETE,
      //   req?.user?.id || null
      // );

      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Couldn't delete instrument category",
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
 *   name: Instrument Category
 *   description: APIs for instrument category operations
 */

/**
 * @swagger
 * /v1/admin/instrument-category/delete/{id}:
 *   delete:
 *     tags: [Admin Instrument Category]
 *     summary: Soft delete an instrument category by ID
 *     description: Marks an instrument category as deleted by setting a deleted_at timestamp.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the instrument category to be deleted.
 *     responses:
 *       '200':
 *         description: Instrument category successfully soft deleted.
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
 *                   example: "Instrument category deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Guitar"
 *       '400':
 *         description: Bad request, category already deleted.
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
 *                   example: "Instrument category is already deleted"
 *       '404':
 *         description: Instrument category not found.
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
 *                   example: "Instrument category not found"
 *       '500':
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
 *                   example: "Couldn't delete instrument category"
 */
