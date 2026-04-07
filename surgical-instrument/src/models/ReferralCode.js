"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("../constants");
const { Schema, model } = require("mongoose");

const SCHEMA = new Schema(
    {
        code: {
            type: String,
            required: true
        },
    },
    {
        collection: COLLECTION.REFERRAL_CODE,
        timestamps: TIMESTAMPS,
    }
);

SCHEMA.static({
    serialize(referral_code) {
        const { _id, code } = referral_code;
        return {
            id: _id,
            code,
        };
    },
    getSelectableFields() {
        return [
            "_id",
            "code",
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

const MODEL = model(NAME.REFERRAL_CODE, SCHEMA);

module.exports = MODEL;
