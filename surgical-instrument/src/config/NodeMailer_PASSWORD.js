"use strict";

const assert = require("assert");

const API_PASSWORD = process.env.NODEMAILER_PASSWORD || null;

assert(
  typeof API_PASSWORD === "string" && API_PASSWORD,
  "Expected <NODEMAILER_EMAIL> to be a valid string"
);

module.exports = API_PASSWORD;
