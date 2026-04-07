"use strict";

const {
    MODEL: NAME,
    COLLECTION,
    TIMESTAMPS,
    PUSH_NOTIFICATION_PLATFORM,
} = require("../constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        platform: {
            type: String,
            enum: Object.values(PUSH_NOTIFICATION_PLATFORM),
            default: true,
        },
        language_id: {
            type: Schema.Types.ObjectId,
            ref: NAME.LANGUAGE,
            default: null,
        },
        firebase_log:
        {
            type: [Schema.Types.Mixed]
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: NAME.USER
        },
        updated_by: {
            type: Schema.Types.ObjectId,
            ref: NAME.USER
        },
        deleted_at: {
            type: Date
        },
        deleted_by: {
            type: Schema.Types.ObjectId,
            ref: NAME.USER
        }
    },
    {
        collection: COLLECTION.PUSH_NOTIFICATION,
        timestamps: TIMESTAMPS,
    }
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
    /**
     * Serialize cartRule object.
     *
     * @memberOf MODEL
     * @param {Object} cartRule
     * @returns {Object}
     */
    serialize(cartRule) {
        const { _id, title, body, platform,firebase_log, language_id, created_at, created_by, updated_at } = cartRule;

        const serialized = {
            id: _id,
            title,
            body,
            firebase_log,
            platform,
            language_id,
            created_at,
            created_by,
            updated_at,
        };

        return serialized;
    },

    /**
     * Returns fields that can be selected by query parameters.
     *
     * @returns {string[]}
     */
    getSelectableFields() {
        return [
            "id",
            "title",
            "body",
            "firebase_log",
            "platform",
            "language_id",
            "created_at",
            "created_by",
            "updated_at",
        ];
    },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
    /**
     * Serialize cartRule object.
     *
     * @memberOf SCHEMA.prototype
     * @returns {Object}
     */
    serialize() {
        return MODEL.serialize(this);
    },
});

// ------------------------- Relations --------------------------

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
    /**
     * Serialize cartRule object.
     *
     * @param {SCHEMA} doc
     * @returns {Object}
     */
    transform(doc) {
        return doc.serialize();
    },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.PUSH_NOTIFICATION, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
