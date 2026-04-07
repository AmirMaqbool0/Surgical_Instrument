"use strict";

const { Schema, model } = require("mongoose");
const { COLLECTION, TIMESTAMPS, MODEL: NAME, SETTINGS_KEYS } = require("../constants");


const SCHEMA = new Schema(
    {
        key: {
            type: String,
            required: true,
        },
        value: {
            type: Schema.Types.Mixed,
            required: true
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
        collection: COLLECTION.SETTINGS,
        timestamps: TIMESTAMPS,
    }
);

SCHEMA.static({
    serialize(setting) {
        const { _id, key, value, created_by } = setting;
        return {
            id: _id,
            key,
            value,
            created_by,
        };
    },
    getSelectableFields() {
        return [
            "_id",
            "key",
            "value",
            "created_by",
        ];
    },
});

SCHEMA.method({
    serialize() {
        return this.constructor.serialize(this);
    },
});

SCHEMA.set("toJSON", {
    transform(doc) {
        return doc.serialize();
    },
});

const MODEL = model(NAME.SETTINGS, SCHEMA);

module.exports = MODEL