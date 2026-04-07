"use strict";

const assert = require("assert");

const API_Email = process.env.NODEMAILER_EMAIL || null;

assert(
  typeof API_Email === "string",
  "Expected <API_URI> to be a valid string",
);

module.exports = API_Email;
