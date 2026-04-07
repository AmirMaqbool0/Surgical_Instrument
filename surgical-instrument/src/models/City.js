"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("../constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
    {
        country_code: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        country_id: {
            country_id: {
                type: Schema.Types.ObjectId,
                ref: NAME.COUNTRY
            },
        },
        state_id: {
            country_id: {
                type: Schema.Types.ObjectId,
                ref: NAME.STATE
            },
        },
        state_code: {
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
        collection: COLLECTION.CITY,
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
        const { id, state_id, country_id, country_code, name, state_code, latitude, longitude, created_at, updated_at } = city;

        const serialized = {
            id,
            country_code,
            name,
            state_id,
            country_id,
            state_code,
            latitude,
            longitude,
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
        return ["id", "state_id", "country_id", "country_code", "name", "state_code", "currency", "created_at", "updated_at", "latitude", "longitude"];
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

const MODEL = model(NAME.CITY, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
