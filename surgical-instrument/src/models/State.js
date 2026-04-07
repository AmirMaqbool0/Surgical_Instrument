"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("../constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
    {
        country_id: {
            type: Schema.Types.ObjectId,
            ref: NAME.COUNTRY
        },
        country_code: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        code: {
            type: String,
            required: true,
        },
        latitude: {
            type: String,
        },
        longitude: {
            type: String,
        }

    },
    {
        collection: COLLECTION.STATE,
        timestamps: TIMESTAMPS,
    },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
    /**
     * Serialize city object.
     *
     * @memberOf MODEL
     * @param {Object} city
     * @returns {Object}
     */
    serialize(city) {
        const { id, country_id, country_code, name, code, created_at, updated_at } = city;

        const serialized = {
            id,
            country_id,
            country_code,
            name,
            code,
            created_at,
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
        return ["id", "country_id", "country_code", "name", "code", "currency", "created_at", "updated_at"];
    },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
    /**
     * Serialize city object.
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
     * Serialize city object.
     *
     * @param {SCHEMA} doc
     * @returns {Object}
     */
    transform(doc) {
        return doc.serialize();
    },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.STATE, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
