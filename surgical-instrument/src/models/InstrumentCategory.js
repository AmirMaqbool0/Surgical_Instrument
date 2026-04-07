"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, INSTRUMENT_CATEGORY_STATUS } = require("../constants");
const { Schema, model } = require("mongoose");

const SCHEMA = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
        },
        category_status: {
            type: String,
            enum: Object.values(INSTRUMENT_CATEGORY_STATUS),
            default: INSTRUMENT_CATEGORY_STATUS.ACTIVE
        },
        display_order: {
            type: Number,
            default: 0
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
        collection: COLLECTION.INSTRUMENT_CATEGORY,
        timestamps: TIMESTAMPS,
    }
);

SCHEMA.statics = {
    serialize(instrument_category) {
        const { _id, name, description, image, category_status, display_order, created_by } = instrument_category;
        return {
            id: _id,
            name,
            description,
            image,
            display_order,
            category_status,
            created_by,
        };
    },
};

SCHEMA.methods = {
    serialize() {
        return this.constructor.serialize(this);
    }
};

SCHEMA.set("toJSON", {
    transform(doc) {
        return doc.serialize();
    },
});

const MODEL = model(NAME.INSTRUMENT_CATEGORY, SCHEMA);

module.exports = MODEL;
