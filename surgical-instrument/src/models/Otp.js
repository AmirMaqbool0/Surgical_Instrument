"use strict";

const { MODEL: NAME, COLLECTION,OTP_PURPOSES } = require("../constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
    {
        purpose: {
            type: String,
            enum: Object.values(OTP_PURPOSES),
            required: true
        },
        identifier: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true
        },
        token: {
            type: String,
            unique:true
        },
        created_at: {
            type: Date,
            default: Date.now,
            required: true,
            expires: 300 // TTL (time to live) in seconds
        },
        deleted_at: {
            type: Date,
        },
        expires_at :{
            type : Date
        }
    },
    {
        collection: COLLECTION.OTP,
    }
);
// SCHEMA.index({ created_at: 1 }, { expireAfterSeconds: 300 });

// ------------------------- Statics ----------------------------

SCHEMA.static({
    /**
     * Returns fields that can be selected by query parameters.
     *
     * @returns {string[]}
     */
    getSelectableFields() {
        return ["purpose", "identifier", "code", "token", "created_at", "expires_at"];
    }
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.OTP, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL
