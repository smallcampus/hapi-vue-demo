'use strict';

const uuid = require('uuid/v4');

/**
 * Test module for replacing plugin/payment.js
 * @see test/default.js
 * @see plugin/payment.js
 */

const paymentGateways = {
    a: {
        name: 'a',
        // Create a payment
        proceed: async (order, payment) => {
            return {
                gateway: 'a',
                refId: uuid(),
            };
        },
    }};

const getPaymentGateway = function(order, payment) {
    return paymentGateways.a;
};

exports.register = function(server, options) {
    // ==== Mongo Extension functions ==================
    server.method('getPaymentGateway', getPaymentGateway);
};

exports.name = 'payment-mock';
exports.multiple = true;
