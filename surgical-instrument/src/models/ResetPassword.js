const { MODEL: NAME, COLLECTION, TIMESTAMPS, } = require("../constants");
const { Schema, model, Types } = require("mongoose");


const SCHEMA = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: NAME.CUSTOMER,
            required: true,
            unique: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 3600,// this is the expiry time in seconds
        },
        deleted_at: {
            type: Date,
        },
    },
    {
        collection: COLLECTION.RESET_PASSWORD,
    });


// ------------------------- Statics ----------------------------

SCHEMA.static({
    /**
     * Serialize resetPassword object.
     *
     * @memberOf MODEL
     * @param {Object} reset_password
     * @returns {Object}
     */
    serialize(reset_password) {
      const {
        id,
        customer,
        opt,
        created_at,
      } = reset_password;
  
      return {
        id,
        customer,
        opt,
        created_at,
      };
    },
  
    /**
     * Returns fields that can be selected by query parameters.
     *
     * @returns {string[]}
     */
    getSelectableFields() {
      return [
        "id",
        "customer",
        "opt",
        "created_at",
      ];
    },
  });
  
  // ------------------------- Methods ----------------------------
  
  SCHEMA.method({
    /**
     * Serialize order object.
     *
     * @memberOf SCHEMA.prototype
     * @returns {Object}
     */
    serialize() {
      return MODEL.serialize(this);
    },
  });
  
  // ------------------------- Settings ---------------------------
  
  SCHEMA.set("toJSON", {
    /**
     * Serialize order object.
     *
     * @param {SCHEMA} doc
     * @returns {Object}
     */
    transform(doc) {
      return doc.serialize();
    },
  });
  
  // ------------------------- Model ------------------------------
  
  const MODEL = model(NAME.RESET_PASSWORD, SCHEMA);
  
  // ------------------------- Exports ----------------------------
  
  module.exports = MODEL;
  