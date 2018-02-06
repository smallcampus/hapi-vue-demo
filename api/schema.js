'use strict';

const Joi = require('joi');

const order = {
    customerName: Joi.string().regex(/^[a-zA-Z\s\.,]+$/),
    customerPhone: Joi.string().alphanum(),
    currency: Joi.string().alphanum(),
    price: Joi.number().strict().precision(2).min(0).max(999999999),
}

const payment = {
    name: Joi.string().regex(/^[a-zA-Z\s\.,]+$/),
    number: Joi.string().creditCard(),
    expiration: Joi.string().regex(/^[0-9]{4}\/[0-9]{2}$/),
    ccv: Joi.string().alphanum().length(3),
}

exports.order=order
exports.payment=payment
exports.form = {
    order,
    payment,
}
