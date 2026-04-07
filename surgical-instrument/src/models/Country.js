"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("../constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    dial_code: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    }

  },
  {
    collection: COLLECTION.COUNTRY,
    timestamps: TIMESTAMPS,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize country object.
   *
   * @memberOf MODEL
   * @param {Object} country
   * @returns {Object}
   */
  serialize(country) {
    const { id, code, name, dial_code, created_at, updated_at } = country;

    const serialized = {
      id,
      code,
      name,
      dial_code,
      created_at,
      updated_at,
    };

    return serialized;
  },

  /**
   * Returns fields that can be selected by query parameters.
   *
   * @returns {string[]}
   */
  getSelectableFields() {
    return ["id", "code", "name", "dial_code", "currency", "created_at", "updated_at"];
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize country object.
   *
   * @memberOf SCHEMA.prototype
   * @returns {Object}
   */
  serialize() {
    return MODEL.serialize(this);
  },
});

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
  /**
   * Serialize country object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.COUNTRY, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
