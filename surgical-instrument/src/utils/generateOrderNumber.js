// src/utils/generateOrderNumber.js
const moment = require("moment");
const { Order } = require("@src/models");

async function generateOrderNumber() {
  const today = moment().format("YYYYMMDD");
  const prefix = `ORD-${today}`;

  const count = await Order.countDocuments({
    createdAt: {
      $gte: moment().startOf("day").toDate(),
      $lte: moment().endOf("day").toDate(),
    },
  });

  const nextNumber = (count + 1).toString().padStart(3, "0");
  return `${prefix}-${nextNumber}`;
}

module.exports = { generateOrderNumber };
