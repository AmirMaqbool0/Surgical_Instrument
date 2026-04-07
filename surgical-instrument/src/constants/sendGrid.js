"use strict";

const MAILGUN_SUBJECT = {
  EMAIL_VERIFICATION: "Confirm Email Address",
  TRANSACTION_CONFIRMATION: "Transaction Confirmation",
  ORDER_CONFIRMATION : "Order Confirmation",
  PASSWORD_RESET_OTP : "Password Reset OTP",
  PASSWORD_RESET_CONFIRMATION: "Password Reset Confirmation",
  WAITING_LIST_USERS_CONFIRMATION: 'Confirm Early Registration',

};

const MAILGUN_TEMPLATE = {
  EMAIL_VERIFICATION: "email-verification",
  TRANSACTION_CONFIRMATION: "transaction",
  ORDER_CREATION : "order-creation",
  PASSWORD_RESET_OTP : 'password-reset-otp',
  PASSWORD_RESET_CONFIRMATION: 'password-reset-confirmation',
  WAITING_LIST_USERS_CONFIRMATION: 'waiting-list-users-confirmation',
};

module.exports = {
  MAILGUN_SUBJECT,
  MAILGUN_TEMPLATE,
};
