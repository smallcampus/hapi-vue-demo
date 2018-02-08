'use strict';

const Boom = require('boom');
const creditCardType = require('credit-card-type');
const stripe = require('stripe')(
    'sk_test_BQokikJOvBiI2HlWgH4olfQ2' // Public testing token
);

// ==== Mock Payment Gateway functions ===========================
const paymentGateways = {
    a: {
        name: 'a',
        // Create a payment
        proceed: async (order, payment) => {
            let charge = await stripe.charges.create({
                amount: Math.round(order.price * 100),
                currency: order.currency,
                source: {
                    object: 'card',
                    number: payment.number,
                    cvc: payment.ccv,
                    exp_year: parseInt(payment.expiration.substr(0, 4)),
                    exp_month: parseInt(payment.expiration.substr(5)),
                },
            }).catch((err) => {
                console.error(err);
                throw Boom.badRequest('payment gateway error', err);
            });
            if (charge.status !== 'succeeded') {
                console.error(charge);
                throw Boom.badRequest('payment gateway error');
            }
            return {
                gateway: 'a',
                refId: charge.id,
            };
        },
    },
    b: {
        name: 'b',
        // Create a payment
        proceed: async (order, payment) => {
            let charge = await stripe.charges.create({
                amount: Math.round(order.price * 100),
                currency: order.currency,
                source: {
                    object: 'card',
                    number: payment.number,
                    cvc: payment.ccv,
                    exp_year: parseInt(payment.expiration.substr(0, 4)),
                    exp_month: parseInt(payment.expiration.substr(5)),
                },
            }).catch((err) => {
                console.error(err);
                throw Boom.badRequest('payment gateway error', err);
            });
            if (charge.status !== 'succeeded') {
                console.error(charge);
                throw Boom.badRequest('payment gateway error');
            }
            return {
                gateway: 'b',
                refId: charge.id,
            };
        },
    }};

/**
 * @method
 * @param {Object} order object
 * @param {Object} payment object
 * @return {Object} payment gateway
 */
const getPaymentGateway = function(order, payment) {
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

exports.getPaymentGateway = getPaymentGateway;
exports.register = function(server, options) {
    server.method('getPaymentGateway', getPaymentGateway);
};

exports.name = 'payment';
exports.multiple = true;
