"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("../constants");
const { Schema, model } = require("mongoose");

const SCHEMA = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: String,
      required: true,
      enum: ["USD", "EUR", "GBP", "INR", "JPY"],
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    delivery_charges: {
      type: Number,
      default: 0,
      min: 0,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: NAME.USER,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: NAME.USER,
    },
    deleted_at: {
      type: Date,
    },
    deleted_by: {
      type: Schema.Types.ObjectId,
      ref: NAME.USER,
    },
  },
  {
    collection: COLLECTION.MANUFACTURER,
    timestamps: TIMESTAMPS,
  }
);

SCHEMA.statics = {
  serialize(manufacturer) {
    const {
      _id,
      name,
      description,
      logo,
      is_active,
      currency,
      country,
      state,
      city,
      area,
      delivery_charges,
      created_by,
    } = manufacturer;

    return {
      id: _id,
      name,
      description,
      logo,
      is_active,
      currency,
      country,
      state,
      city,
      area,
      delivery_charges,
      created_by,
    };
  },
};

SCHEMA.methods = {
  serialize() {
    return this.constructor.serialize(this);
  },
};

SCHEMA.set("toJSON", {
  transform(doc) {
    return doc.serialize();
  },
});

const MODEL = model(NAME.MANUFACTURER, SCHEMA);

module.exports = MODEL;
