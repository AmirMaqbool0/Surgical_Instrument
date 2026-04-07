"use strict";

const { Schema, model } = require('mongoose');
const { MODEL, COLLECTION, TIMESTAMPS } = require('@src/constants');


const BundleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    pack_size: {
      type: Number,
      required: true,
      min: 1,
    },
    items: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: false,
          default: 1,
        },
      },
    ],
    price: {
      type: Number,
      required: false,
      min: 0,
    },
    display_order: {
      type: Number,
      default: 0,
      min: 0,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deleted_at: {
      type: Date,
    },
    deleted_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: COLLECTION.BUNDLE,
    timestamps: TIMESTAMPS,
  }
);


module.exports = model(MODEL.BUNDLE, BundleSchema);
