"use strict";

const {
  MODEL: NAME,
  COLLECTION,
  TIMESTAMPS,
  CUSTOMER_GENDER,
  CUSTOMER_STATUS,
} = require("../constants");
const { Schema, model } = require("mongoose");

const SCHEMA = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
    },
    date_of_birth: {
      date: {
        type: Number,
      },
      month: {
        type: Number,
      },
      year: {
        type: Number,
      },
    },
    gender: {
      type: String,
      enum: Object.values(CUSTOMER_GENDER),
    },
    country_code: {
      type: String,
    },
    email_verified_at: {
      type: Date,
    },
    phone_number: {
      code: {
        type: String,
      },
      number: {
        type: String,
      },
    },
    phone_number_verified_at: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(CUSTOMER_STATUS),
      default: CUSTOMER_STATUS.ACTIVE,
    },
    terms_and_conditions_consent: {
      type: Boolean,
      default: false,
    },
    device_token: {
      type: String,
    },
    privacy_policy_consent: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
    channel: {
      type: String,
      enum: ["android", "iphone", "desktop"],
    },
  },
  {
    collection: COLLECTION.CUSTOMER,
    timestamps: TIMESTAMPS,
  }
);

SCHEMA.statics = {
  serialize(customer) {
    const {
      _id,
      firstName,
      lastName,
      email,
      date_of_birth,
      gender,
      profile_pic,
      country_code,
      phone_number,
      email_verified_at,
      phone_number_verified_at,
      twoFA_enabled,
      terms_and_conditions_consent,
      privacy_policy_consent,
      device_token,
      created_at,
      updated_at,
      deleted_at,
      channel,
      status,
    } = customer;

    return {
      id: _id,
      firstName,
      lastName,
      email,
      date_of_birth,
      gender,
      profile_pic,
      country_code,
      phone_number,
      email_verified: email_verified_at != null,
      phone_number_verified: phone_number_verified_at != null,
      terms_and_conditions_consent,
      privacy_policy_consent,
      device_token,
      created_at,
      updated_at,
      deleted_at,
      channel,
      status,
    };
  },
  getSelectableFields() {
    return [
      "_id",
      "firstName",
      "lastName",
      "email",
      "date_of_birth",
      "gender",
      "profile_pic",
      "country_code",
      "phone_number",
      "email_verified_at",
      "phone_number_verified_at",
      "terms_and_conditions_consent",
      "privacy_policy_consent",
      "device_token",
      "created_at",
      "updated_at",
      "deleted_at",
      "channel",
      "status",
    ];
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

const MODEL = model(NAME.CUSTOMER, SCHEMA);

module.exports = MODEL;
