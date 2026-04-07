"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, TICKET_SUPPORT_TYPES, TICKET_STATUS } = require("../constants");
const { ref } = require("joi");
const { Schema, model } = require("mongoose");

const SCHEMA = new Schema(
    {
        user_id: {
            type: String,
            ref: NAME.CUSTOMER
        },
        support_type: {
            type: String,
            enum: Object.values(TICKET_SUPPORT_TYPES),
            required: true
        },
        ticket_status: {
            type: String,
            enum: Object.values(TICKET_STATUS),
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        attachment: {
            type: [String]
        },
        ticket_number: {
            type: String
        },
        updated_by: {
            type : Schema.Types.ObjectId,
            ref : NAME.USER
        },
    },
    {
        collection: COLLECTION.TICKET,
        timestamps: TIMESTAMPS,
    }
);

SCHEMA.statics = {
    serialize(ticket) {
        const { _id, user_id, support_type, ticket_status, title, description, attachment, ticket_number, updated_by } = ticket;
        return {
            id: _id,
            user_id,
            support_type,
            ticket_status,
            title,
            description,
            attachment,
            ticket_number,
            updated_by,
        };
    },
    getSelectableFields() {
        return [
            "_id",
            "user_id",
            "support_type",
            "ticket_status",
            "title",
            "description",
            "attachment",
            "ticket_number",
            "updated_by",
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

const MODEL = model(NAME.TICKET, SCHEMA);

module.exports = MODEL;
