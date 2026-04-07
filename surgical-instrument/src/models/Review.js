"use strict";

const { Schema, model } = require("mongoose");
const { MODEL, COLLECTION, REVIEW_STATUS, REVIEW_TYPE, TIMESTAMPS } = require("@src/constants");

const ReviewSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,  // remove leading and trailing whitespace.
      maxlength: 100, // max length of title,
      minlength: 1, // min length of title
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500, // max length of description,
      minlength: 10, // min length of description
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: MODEL.CUSTOMER,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
      default: REVIEW_STATUS.PENDING,
    },
    type:{
      type: String,
      enum: Object.values(REVIEW_TYPE),
      default: REVIEW_TYPE.PRODUCT,
    },
    type_id: {
      type: Schema.Types.ObjectId,
      ref: MODEL.PRODUCT,
      required: true,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: COLLECTION.REVIEW,
    timestamps: TIMESTAMPS,
  }
);

module.exports = model(MODEL.REVIEW, ReviewSchema);
