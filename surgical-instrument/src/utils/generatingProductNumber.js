"use strict";

const { Product, Manufacturer } = require("@src/models");

async function generateProductNumber(manufacturer, categoryName) {
    
    const manufacturerCode = manufacturer.substring(0, 2).toUpperCase();
    const categoryCode = categoryName.substring(0, 2).toUpperCase();

    const digits = "0123456789";
    let randomNumber = "";
    for (let i = 0; i < 5; i++) {
        randomNumber += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return `${manufacturerCode}${categoryCode}-${randomNumber}`;
}

async function generateUniqueProductNumber(manufacturer, categoryName) {
    let productNumber, existingNumbers;
    do {
        productNumber = await generateProductNumber(manufacturer, categoryName);
        existingNumbers = await Product.find().select({ product_number: 1 });
        existingNumbers = existingNumbers.map(product => product.product_number);
    } while (existingNumbers.includes(productNumber));

    return productNumber;
}

module.exports = generateUniqueProductNumber;
