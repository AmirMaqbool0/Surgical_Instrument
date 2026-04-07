"use strict";

const ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
  STAGING : "staging"
};

const RELEASE = {
  PRODUCTION: "production",
  STAGING: "staging",
  DEVELOPMENT : 'development'
};

const DAYS = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday'
};

const BRAND = "Surgical Instrument";

module.exports = {
  ENV,
  RELEASE,
  BRAND,
  DAYS,
};
