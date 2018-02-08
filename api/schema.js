'use strict';

const Joi = require('joi');

/**
 * Contain all entity schema used by request and response
 */

/**
 * Example value:
 * {
 *     customerName: 'Test Mak',
 *     customerPhone: '88888888',
 *     currency: 'HKD',
 *     price: 100.1
 * }
 */
const formOrder = {
    customerName: Joi.string()
        .regex(/^[a-zA-Z\s\.,]+$/)
        .example('Test, N. Name'),
    customerPhone: Joi.string()
        .alphanum()
        .example('88889999'),
    currency: Joi.string()
        .alphanum()
        .example('HKD'),
    price: Joi.number().strict()
        .precision(2)
        .min(0)
        .max(999999999)
        .example(100.12),
}

const dbOrder = {
    customerName: Joi.string()
        .regex(/^[a-zA-Z\s\.,]+$/)
        .example('Test, N. Name'),
    customerPhone: Joi.string()
        .alphanum()
        .example('88889999'),
    currency: Joi.string()
        .alphanum()
        .example('HKD'),
    price: Joi.number().strict()
        .precision(2)
        .min(0)
        .max(999999999)
        .example(100.12),
    gateway: Joi.string()
        .example('a'),
    refId: Joi.string()
        .example('uuid'),
    _id: Joi.any()
        .example('uuid'),
    status: Joi.string()
        .example('charged'),
}

/**
 * Example value:
 * {
 *     name: 'Test Mak',
 *     number: '378282246310005',
 *     expiration: '2000/01',
 *     ccv: '123'
 * }
 */
const formPayment = {
    name: Joi.string()
        .regex(/^[a-zA-Z\s\.,]+$/)
        .example('Test, N. Name'),
    number: Joi.string()
        .creditCard()
        .example('4911111111111111'),
    expiration: Joi.string()
        .regex(/^[0-9]{4}\/[0-9]{2}$/)
        .example('2017/01'),
    ccv: Joi.string()
        .alphanum()
        .length(3)
        .example('137'),
}

exports.dbOrder=dbOrder
exports.formOrder=formOrder
exports.formPayment=formPayment
exports.form = {
    order: formOrder,
    payment: formPayment,
}
