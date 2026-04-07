"use strict";

const { Schema, model } = require("mongoose");
const { MODEL, COLLECTION, TIMESTAMPS, ORDER_STATUS, DELIVERY_STATUS,PAYMENT_STATUS,PAYMENT_METHOD } = require("@src/constants");

const OrderSchema = new Schema(
    {
        order_number: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        personal_info: {
            first_name: { 
                type: String, 
                required: true 
            },
            last_name: { 
                type: String, 
                required: true
            },
            email: { 
                type: String, 
                required: true 
            },
            phone: { 
                type: String, 
                required: true 
            },
            country: {
                type: String,
                required: true,
            },
            address: { 
                type: String, 
                required: true 
            },
            city: { 
                type: String, 
                required: true 
            },
            state: { 
                type: String, 
                required: true 
            },
            zip_code: { 
                type: String, 
                required: true 
            },
        

        },
        cart_info: [
            {
                product_id: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { 
                    type: Number, 
                    required: true, 
                    min: 1 
                },
                price: { 
                    type: Number, 
                    required: true, 
                    min: 0 
                },
                _id: false,
            },
        ],
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        discount_amount: {
            type: Number,
            default: 0,
            min: 0,
        },
        
        currency: {
            type: String,
            required: true,
        },
        payment_info: {
            mode: { 
                type: String,
                enum: Object.values(PAYMENT_METHOD),
                required: true 
            },
            status: { 
                type: String, 
                enum: Object.values(PAYMENT_STATUS), 
                default: PAYMENT_STATUS.PENDING 
            },
            platform: { 
                type: String 
            },
            confirmation_id: { 
                type: String 
            },
        },
        delivery_info: {
            status: {
                type: String,
                enum: Object.values(DELIVERY_STATUS),
                default: DELIVERY_STATUS.PENDING,
            },
            delivery_date: { 
                type: Date 
            },
            delivery_charges: {
                type: Number,
                default: 0,
                min: 0,
            },
            delivery_address: {
                type: String,
                required: false,
                trim: true,
            },
        
        },
        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PENDING,
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updated_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        deleted_at: {
            type: Date,
        },
        deleted_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        collection: COLLECTION.ORDER,
        timestamps: TIMESTAMPS,
    }
);

module.exports = model(MODEL.ORDER, OrderSchema);
