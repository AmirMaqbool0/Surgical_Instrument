"use strict";

const { Schema, model } = require("mongoose");
const { MODEL, COLLECTION, TIMESTAMPS, NEWS_EVENT_CATEGORY } = require("@src/constants");

const NewsEventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(NEWS_EVENT_CATEGORY),
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: () => new Date(new Date().setHours(0, 0, 0, 0))
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: MODEL.USER,
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
    collection: COLLECTION.NEWS_EVENT,
    timestamps: TIMESTAMPS,
  }
);

module.exports = model(MODEL.NEWS_EVENT, NewsEventSchema);
