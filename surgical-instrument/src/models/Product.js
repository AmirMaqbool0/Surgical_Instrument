"use strict";

const { Schema, model } = require("mongoose");
const { MODEL, COLLECTION, TIMESTAMPS } = require("@src/constants");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    short_desc: {
      type: String,
      required: true,
      trim: true,
    },
    long_desc: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    manufacturer_id: {
      type: Schema.Types.ObjectId,
      ref: MODEL.MANUFACTURER,
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: MODEL.INSTRUMENT_CATEGORY,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    product_number: {
      type: String,
      required: true,
      unique: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: MODEL.USER,
      required: true,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: MODEL.USER,
    },
    deleted_at: {
      type: Date,
    },
    deleted_by: {
      type: Schema.Types.ObjectId,
      ref: MODEL.USER,
    },
  },
  {
    collection: COLLECTION.PRODUCT,
    timestamps: TIMESTAMPS,
  }
);

module.exports = model(MODEL.PRODUCT, ProductSchema);
