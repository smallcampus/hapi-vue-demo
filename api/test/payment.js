'use strict';

const test = require('ava');
const getPaymentGateway = require('../plugin/payment').getPaymentGateway;

/**
 * Test choosing the correct payment gateway,
 * DID NOT test the actual payment logic
 */

// test('gateway test | a | proceed', async (t) => {
//     const order = {
//         currency: 'HKD',
//     };
//     const payment = {
//         name: 'Test Mak',
//         number: '378282246310005', // AMEX card
//         expiration: '2020/01',
//         ccv: '111',
//     };
//
//     const gateway = getPaymentGateway(order, payment);
//     t.is(gateway.name, 'a', 'a');
//     await gateway.proceed(order, payment);
// });

test('gateway test | a | HKD & AMEX', async (t) => {
    const order = {
        currency: 'HKD',
    };
    const payment = {
        name: 'Test Mak',
        number: '378282246310005', // AMEX card
        expiration: '2020/01',
        ccv: '111',
    };

    const gateway = getPaymentGateway(order, payment);
    t.is(gateway.name, 'a', 'a');
});

test('gateway test | b | HKD & VISA', (t) => {
    const order = {
        currency: 'HKD',
    };
    const payment = {number: '4111111111111111'};

    const gateway = getPaymentGateway(order, payment);
    t.is(gateway.name, 'b', 'b');
});

test('gateway test | a | USD & VISA', (t) => {
    const order = {
        currency: 'USD',
    };
    const payment = {number: '378282246310005'};

    const gateway = getPaymentGateway(order, payment);
    t.is(gateway.name, 'a', 'a');
});

test('gateway test | a | USD & Invalid', (t) => {
    const order = {
        currency: 'USD',
    };
    const payment = {number: 'unknown'};

    const gateway = getPaymentGateway(order, payment);
    t.is(gateway.name, 'a', 'a');
});

test('gateway test | a | Invalid & Invalid', (t) => {
    const order = {
        currency: 'unknown',
    };
    const payment = {number: 'unknown'};

    const gateway = getPaymentGateway(order, payment);
    t.is(gateway.name, 'b', 'b');
});

test('gateway test | a | Invalid & AMEX', (t) => {
    const order = {
        currency: 'unknown',
    };
    const payment = {number: '378282246310005'};

    const gateway = getPaymentGateway(order, payment);
    t.is(gateway.name, 'a', 'a');
});
