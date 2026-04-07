"use strict";

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  API_URI: require("./API_URI"),
  API_PORT: require("./API_PORT"),
  AUTH_URI: require("./AUTH_URI"),
  MONGODB_URI: require("./MONGODB_URI"),
  NODE_ENV: require("./NODE_ENV"),
  RELEASE_ENV: require("./RELEASE_ENV"),
  S3_ACCESS_KEY_ID: require("./S3_ACCESS_KEY_ID"),
  S3_BUCKET: require("./S3_BUCKET"),
  S3_ENDPOINT: require("./S3_ENDPOINT"),
  S3_REGION: require("./S3_REGION"),
  S3_SECRET_ACCESS_KEY: require("./S3_SECRET_ACCESS_KEY"),
};
