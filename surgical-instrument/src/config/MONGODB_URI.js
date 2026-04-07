"use strict";

const { ENV } = require("@src/constants");
const assert = require("assert");
const NODE_ENV = require("./NODE_ENV");

const MONGODB_URI = process.env.MONGODB_URI || null;

/* istanbul ignore next */
if (NODE_ENV !== ENV.TEST) {
  assert(
    typeof MONGODB_URI === "string",
    "Expected <MONGODB_URI> to be a valid string",
  );
}

module.exports = MONGODB_URI;
