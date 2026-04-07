"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS,FAQ_STATUS  } = require("../constants");
const { Schema, model } = require("mongoose");

const SCHEMA = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(FAQ_STATUS),
            required: true,
            default : FAQ_STATUS.ACTIVE
        },
        display_order: {
            type: Number,
            required: true
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
        collection: COLLECTION.FAQ,
        timestamps: TIMESTAMPS,
    }
);

SCHEMA.statics = {
    serialize(faq) {
        const { _id, title, description, status, display_order, created_by } = faq;
        return {
            id: _id,
            title,
            description,
            status,
            display_order,
            created_by,
        };
    },
    getSelectableFields() {
        return [
            "_id",
            "title",
            "description",
            "status",
            "display_order",
            "created_by",
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

const MODEL = model(NAME.FAQ, SCHEMA);

module.exports = MODEL;
