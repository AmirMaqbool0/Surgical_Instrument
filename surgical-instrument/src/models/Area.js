"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("../constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        country_id: {
                type: Schema.Types.ObjectId,
                ref: NAME.COUNTRY
        },
        state_id: {
                type: Schema.Types.ObjectId,
                ref: NAME.STATE
        },
        city_id: {
                type: Schema.Types.ObjectId,
                ref: NAME.CITY
        },
        latitude: {
            type: String,
        },
        longitude: {
            type: String,
        },
        created_by: {
            type : Schema.Types.ObjectId,
            ref : NAME.USER
        },
        updated_by: {
            type : Schema.Types.ObjectId,
            ref : NAME.USER
        },
        deleted_at: {
            type: Date
        },
        deleted_by: {
            type : Schema.Types.ObjectId,
            ref : NAME.USER
        }
    },
    {
        collection: COLLECTION.AREA,
        timestamps: TIMESTAMPS,
    },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
    /**
     * Serialize area object.
     *
     * @memberOf MODEL
     * @param {Object} area
     * @returns {Object}
     */
    serialize(area) {
        const { id, state_id, country_id, city_id, name, latitude, longitude, created_at, created_by, updated_at } = area;

        const serialized = {
            id,
            name,
            state_id,
            country_id,
            city_id,
            latitude,
            longitude,
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
        return ["id", "state_id", "country_id","city_id", "name", "currency", "created_at", "updated_at", "latitude", "longitude", "created_by"];
    },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
    /**
     * Serialize area object.
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
     * Serialize area object.
     *
     * @param {SCHEMA} doc
     * @returns {Object}
     */
    transform(doc) {
        return doc.serialize();
    },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.AREA, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
