"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, RATING_STATUS } = require("../constants");
const { Schema, model } = require("mongoose");

const SCHEMA = new Schema(
    {
      customer_id: {
            type: Schema.Types.ObjectId,
            ref: NAME.CUSTOMER,
            required: true,
        },
        ratings: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        message: {
            type: String,
            required: false,
        },
        picture: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: Object.values(RATING_STATUS),
            required: true,
            default: RATING_STATUS.PENDING,
        },
        deleted_at: {
            type: Date,
        },
    },
    {
        collection: COLLECTION.RATING,
        timestamps: TIMESTAMPS,
    }
);

SCHEMA.statics = {
    serialize(rating) {
        const {
            _id,
            product_id,
            merchant_id,
            customer_id,
            ratings,
            message,
            picture,
            status,
            created_at,
            updated_at,
        } = rating;
        return {
            id: _id,
            product_id,
            merchant_id,
            customer_id,
            ratings,
            message,
            picture,
            status,
            created_at,
            updated_at,
        };
    },
    getSelectableFields() {
        return [
            "_id",
            "product_id",
            "merchant_id",
            "customer_id",
            "ratings",
            "message",
            "picture",
            "status",
            "created_at",
            "updated_at",
        ];
    }
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

const MODEL = model(NAME.RATING, SCHEMA);

module.exports = MODEL;
