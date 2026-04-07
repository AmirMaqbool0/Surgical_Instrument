"use strict";
const { Bundle } = require("@src/models");
const { VerifyAdminAuth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const {
  STATUS_CODE,
  RESPONSE_ACTION,
  LOG_TYPE,
  HTTP_VERBS,
} = require("@src/constants");
const {
  response,
} = require("@src/utils");
const { Joi } = require("@src/lib");

const CONTROLLER = [
  VerifyAdminAuth(),
  async function deleteBundleAdminV1Controller(req, res) {
    try {
          const { id } = req.params;
          const { user } = req;
    
          const bundle = await Bundle.findOne({ _id: id, $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }] });
    
          if (!bundle) {
            return response.send(
              0,
              STATUS_CODE.NOT_FOUND,
              "Bundle not found or already deleted",
              null,
              res
            );
          }

          bundle.deleted_at = new Date();
          bundle.deleted_by = user.id;
          await bundle.save();

          return response.send(
            1,
            STATUS_CODE.OK,
            "Bundle deleted successfully",
            { name: bundle.name },
            res,
            null
          );
        } catch (error) {
          console.error(error.message ?? error);
    
          // insertMessageLog(
          //   LOG_TYPE.ERROR,
          //   `Exception while deleting a bundle: ${error?.message}`,
          //   {
          //     message: error?.message,
          //     stack: error?.stack,
          //     errorObject: error,
          //   },
          //   `/v1/admin/bundle/delete/${req.params.id}`,
          //   HTTP_VERBS.DELETE,
          //   req?.user?.id || null
          // );
    
          return response.send(
            0,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            "Couldn't delete bundle",
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
 * /v1/admin/bundle/delete/{id}:
 *   delete:
 *     tags: [Admin Bundle]
 *     summary: Soft delete a bundle
 *     description: Marks a bundle as deleted by setting a deleted_at timestamp.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bundle to delete.
 *     responses:
 *       200:
 *         description: Bundle deleted successfully.
 *       404:
 *         description: Bundle not found.
 *       500:
 *         description: Internal server error.
 */