"use strict";

const ERROR = {
  NOT_FOUND: "not-found",
  CONFLICT: "conflict",
  CUSTOMER_NOT_FOUND: "customer-not-found",
  CUSTOMER_ALREADY_EXIST: "customer-already-exist",
  CUSTOMER_NOT_VERIFIED: "customer-not-verified",
  USER_NOT_FOUND: "user-not-found",
  USER_ALREADY_EXIST: "user-already-exist",
  USER_NOT_VERIFIED: "user-not-verified",
  INSUFFICIENT_FUNDS: "insufficient-funds",
  UNAUTHORIZED: "unauthorized",
  ACCESS_TOKEN_MISSING: "access-token-missing",
  FORBIDDEN: "forbidden",
  UNPROCESSABLE_ENTITY: "unprocessable-entity",
  BAD_REQUEST: "bad-request",
  INTERNAL_SERVER_ERROR: "internal-server-error",
  PAYMENT_REQUIRED: "payment-required",
  UNKNOWN_EMAIL: "unknown-email",
  EMAIL_NOT_VERIFIED: "email-not-verified",
  MISSING_ATTACHMENT: "missing-attachment",
  EXCEEDS_SIZE_LIMIT: "exceeds-size-limit",
  UNSUPPORTED_FORMAT: "unsupported-format",
  COMPLETE_TWO_FACTOR_AUTHENTICATION_FIRST:
    "complete-two-factor-authentication-first",
  INVALID_TWO_FA_CODE: "invalid-two-fa-code",
  PHONE_NUMBER_ALREADY_REGISTERED: "phone-number-already-registered",
  EMAIL_ALREADY_EXIST: "email-already-exist",
  UNSUPPORTED_MEDIA_TYPE: "unsupported-media-type",
  MISSING_MERCHANT_ID: "missing-merchant-id",
  ALREADY_EXISTS: "already-exists",
  MISSING_VALUES: "missing-values",
  DOMAIN_ALREADY_EXIST: "domain-already-exists",
  INVALID_BASE64_STRING: "invalid-base64-string",
};

const LOG_TYPE = {
  ERROR: "error",
  MESSAGE: "message"
}

module.exports = {
  ERROR,
  LOG_TYPE
};
