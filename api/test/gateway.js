'use strict';

const test = require('ava');
const manager = require('../util/payment-gateway');

test('gateway test | a | HKD & AMEX', (t) => {
    const order = {
        currency: 'HKD',
    };
    const payment = {number: '378282246310005'};

    const gateway = manager.getPaymentGateway(order, payment);
    t.is(gateway.name, 'a', 'a');
});

test('gateway test | b | HKD & VISA', (t) => {
    const order = {
        currency: 'HKD',
    };
    const payment = {number: '4111111111111111'};

    const gateway = manager.getPaymentGateway(order, payment);
    t.is(gateway.name, 'b', 'b');
});

test('gateway test | a | USD & VISA', (t) => {
    const order = {
        currency: 'USD',
    };
    const payment = {number: '378282246310005'};

    const gateway = manager.getPaymentGateway(order, payment);
    t.is(gateway.name, 'a', 'a');
});

test('gateway test | a | USD & Invalid', (t) => {
    const order = {
        currency: 'USD',
    };
    const payment = {number: 'unknown'};

    const gateway = manager.getPaymentGateway(order, payment);
    t.is(gateway.name, 'a', 'a');
});

test('gateway test | a | Invalid & Invalid', (t) => {
    const order = {
        currency: 'unknown',
    };
    const payment = {number: 'unknown'};

    const gateway = manager.getPaymentGateway(order, payment);
    t.is(gateway.name, 'b', 'b');
});

test('gateway test | a | Invalid & AMEX', (t) => {
    const order = {
        currency: 'unknown',
    };
    const payment = {number: '378282246310005'};

    const gateway = manager.getPaymentGateway(order, payment);
    t.is(gateway.name, 'a', 'a');
});
