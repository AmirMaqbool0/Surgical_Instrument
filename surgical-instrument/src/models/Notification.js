"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, NOTIFICATION_STATUS, NOTIFICATION_TYPES } = require("../constants");
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
        entity_type: {
            type: String,
            required: true
        },
        entity_id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(NOTIFICATION_STATUS),
            required: true
        },
        type: {
            type: String,
            enum: Object.values(NOTIFICATION_TYPES),
            required: true
        },
        customer_id: {
            type: Schema.Types.ObjectId,
            ref: COLLECTION.CUSTOMER,
        },
        deleted_at: {
            type: Date,
        },
    },
    {
        collection: COLLECTION.NOTIFICATION,
        timestamps: TIMESTAMPS,
    }
);

SCHEMA.statics = {
    serialize(notification) {
        const { _id, title, description, url, datetime, status, type, customer_id, entity_type, entity_id, created_at, updated_at } = notification;
        return {
            id: _id,
            title,
            description,
            url,
            datetime,
            status,
            type,
            customer_id,
            entity_type,
            entity_id,
            created_at,
            updated_at
        };
    },
    getSelectableFields() {
        return [
            "_id",
            "title",
            "description",
            "url",
            "datetime",
            "status",
            "type",
            "customer_id",
            "entity_type",
            "entity_id",
            "created_at",
            "updated_at"
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

const MODEL = model(NAME.NOTIFICATION, SCHEMA);

module.exports = MODEL;
