"use strict";

const S3_ACL = {
  PRIVATE: "private",
  PUBLIC: "public-read",
};

const S3_UPLOAD_FOLDER = {
  CATEGORY: "category",
  SLIDER: "slider",
  RATING: "rating",
  CUSTOMER: "customer",
  INSTRUMENT_CATEGORY: "instrument-category",
  MANUFACTURER: "manufacturer",
  PRODUCT: "product",
  CUSTOMER: "customer",
  USER: "user",
  NEWS_EVENT: "news-event",
  BUNDLE: "bundle",
};

const S3_MAX_IMAGE_SIZE = 3 * 1024 * 1024 + 1; // 3 megabytes

const SUPPORTED_IMAGE_FORMATS = {
  JPEG: "jpeg",
  PNG: "png",
  WEBP: "webp",
  TIFF: "tiff",
  GIF: "gif",
  SVG: "svg",
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

module.exports = {
  S3_ACL,
  S3_UPLOAD_FOLDER,
  S3_MAX_IMAGE_SIZE,
  SUPPORTED_IMAGE_FORMATS,
  MAX_FILE_SIZE_BYTES,
};