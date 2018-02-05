'use strict';

const uuidv4 = require('uuid/v4');
const creditCardType = require('credit-card-type');

// ==== Mock Payment Gateway functions ===========================
const paymentGateways = {
    a: {
        name: 'a',
        proceed: async (order, payment) => {
            return {gateway: 'a', refId: uuidv4()};
        },
    },
    b: {
        name: 'b',
        proceed: async (order, payment) => {
            return {gateway: 'b', refId: uuidv4()};
        },
    }};
/**
 * @method
 * @param {Object} order object
 * @param {Object} payment object
 * @return {Object} payment gateway
 */
exports.getPaymentGateway = function(order, payment) {
    const ccTypes = creditCardType(payment.number)
        .map((item) => {
            return item.type;
        });

    if (ccTypes.indexOf('american-express') !== -1) {
        return paymentGateways.a;
    }
    switch (order.currency) {
        case 'USD':
        case 'AUD':
        case 'EUR':
        case 'JPY':
        case 'CNY':
            return paymentGateways.a;
        default:
            return paymentGateways.b;
    }
};