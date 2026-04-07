"use strict";

const { Order } = require("@src/models");

async function generateOrderNumber() {
    
    const prefix = "#";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    const randomLetters =
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length));

    const digits = "0123456789";
    let randomNumber = "";
    for (let i = 0; i < 3; i++) {
        randomNumber += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return `${prefix}${randomLetters}${randomNumber}`;
}

async function generateUniqueOrderNumber() {
    let orderNumber, existingNumbers;
    do {
        orderNumber = await generateOrderNumber();
        existingNumbers = await Order.find().select({ order_number: 1 });
        existingNumbers = existingNumbers.map(order => order.order_number);
    } while (existingNumbers.includes(orderNumber));

    return orderNumber;
}

module.exports = generateUniqueOrderNumber;
