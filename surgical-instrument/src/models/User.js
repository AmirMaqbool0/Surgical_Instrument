"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("../constants");
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
      unique: true,
      match: [/.+@.+\..+/, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
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
    collection: COLLECTION.USER,
    timestamps: TIMESTAMPS,
  },
);

SCHEMA.statics = {
  serialize(user) {
    const { _id, name, email, password, roles, created_by } = user;
    return {
      id: _id,
      name,
      email,
      roles,
      password,
      created_by,
    };
  },
  getSelectableFields() {
    return [
      "_id",
      "name",
      "email",
      "roles",
      "password",
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


const MODEL = model(NAME.USER, SCHEMA);

module.exports = MODEL;
