"use strict";

const { MONGODB_URI } = require("./src/config");
const mongoose = require("mongoose");

mongoose
  .connect(
    MONGODB_URI,
  )
  .then(() => console.log("MongoDB connection established"))
  .catch(error => {
    console.error(error);

    process.exit(1);
  });
