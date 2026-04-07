"use strict";

const MODEL = {
  CUSTOMER: "Customer",
  RESET_PASSWORD: "ResetPassword",
  COUNTRY: "Country",
  OTP: "Otp",
  REFERRAL_CODE: "ReferralCode",
  FAQ: "FAQ",
  TICKET: "Ticket",
  CATEGORY: "Category",
  NOTIFICATION: "Notification",
  RATING: "Rating",
  ORDER: "Order",
  USER: "User",
  CITY: "City",
  STATE: "State",
  LANGUAGE: "Language",
  AREA: "Area",
  ROLE: "Role",
  PUSH_NOTIFICATION: "PushNotification",
  SETTINGS: "Settings",
  SLIDER: "Slider",
  INSTRUMENT_CATEGORY : "InstrumentCategory",
  MANUFACTURER: "Manufacturer",
  PRODUCT: "Product",
  REVIEW: "Review",
  NEWS_EVENT: "NewsEvent",
  BUNDLE: "Bundle",
};

const COLLECTION = {
  
  CUSTOMER: "customers",
  RESET_PASSWORD: "reset_password",
  COUNTRY: "country",
  OTP: "otp",
  REFERRAL_CODE: "referral_code",
  FAQ: "faq",
  TICKET: "ticket",
  CATEGORY: "category",
  NOTIFICATION: "notification",
  RATING: "rating",
  ORDER: "order",
  USER: "users",
  CITY: "city",
  STATE: "state",
  LANGUAGE: "language",
  AREA: "area",
  ROLE: "role",
  PUSH_NOTIFICATION: "push_notification",
  SETTINGS: "settings",
  SLIDER: "slider",
  INSTRUMENT_CATEGORY : "instrument_category",
  MANUFACTURER: "manufacturer",
  PRODUCT: "product",
  REVIEW: "review",
  NEWS_EVENT: "news_event",
  BUNDLE: "bundle",
};

const TIMESTAMPS = {
  createdAt: "created_at",
  updatedAt: "updated_at",
};

const OWNER = {
  USER: "USER",
  CLIENT: "CLIENT",
};

module.exports = {
  MODEL,
  COLLECTION,
  TIMESTAMPS,
  OWNER,
};
