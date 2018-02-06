'use strict';

const test = require('ava');
const Glue = require('glue');
const {manifest, options} = require('../manifest');
// const winston = require('winston');
// winston.level = 'debug';

let server;

test.before(async () => {
    // This runs before all tests
    server = await Glue.compose(manifest, options);
});

const testOrder = {
    customerName: 'test',
    customerPhone: '88888888',
    currency: 'HKD',
    price: 100.1,
};

let order;
test.serial('endpoint test | GET /order/create | AMEX | 200', async (t) => {
    const request = {
        method: 'POST',
        url: '/order/create',
        payload: {
            order: testOrder,
            payment: {
                name: 'Test Mak',
                number: '378282246310005', // AMEX card
                expiration: '2017/01',
                ccv: '111',
            },
        },
    };

    const res = await server.inject(request);

    t.is(res.statusCode, 200, '200');

    order = res.result;
    t.true(order !== undefined, 'must has order');
    t.is(order.currency, testOrder.currency, 'currency');
    t.is(order.price, testOrder.price, 'price');
    t.is(order.customerPhone, testOrder.customerPhone, 'customerPhone');
    t.is(order.customerName, testOrder.customerName, 'customerName');
    t.is(order.gateway, 'a', 'gateway');
    t.true(order._id !== undefined, 'must has _id');
    t.true(order.refId !== undefined, 'must has refId');
});

test.serial('endpoint test | GET /order/find?refId | AMEX | 200', async (t) => {
    const request = {
        method: 'GET',
        url: `/order/find?refId=${order.refId}`,
        payload: {},
    };

    const res = await server.inject(request);
    t.is(res.statusCode, 200);

    order = res.result;
    t.true(order !== undefined, 'must has order');
    t.is(order.currency, testOrder.currency, 'currency');
    t.is(order.price, testOrder.price, 'price');
    t.is(order.customerPhone, testOrder.customerPhone, 'customerPhone');
    t.is(order.customerName, testOrder.customerName, 'customerName');
    t.is(order.gateway, 'a', 'gateway');
    t.true(order._id !== undefined, 'must has _id');
    t.true(order.refId !== undefined, 'must has refId');
});

test.serial('endpoint test | GET /order/find?orderId | AMEX | 200',
    async (t) => {
        const request = {
            method: 'GET',
            url: `/order/find?orderId=${order._id}`,
            payload: {},
        };

        const res = await server.inject(request);
        t.is(res.statusCode, 200);

        order = res.result;
        t.true(order !== undefined, 'must has order');
        t.is(order.currency, testOrder.currency, 'currency');
        t.is(order.price, testOrder.price, 'price');
        t.is(order.customerPhone, testOrder.customerPhone, 'customerPhone');
        t.is(order.customerName, testOrder.customerName, 'customerName');
        t.is(order.gateway, 'a', 'gateway');
        t.true(order._id !== undefined, 'must has _id');
        t.true(order.refId !== undefined, 'must has refId');
    });

test('endpoint test | GET /order/find?refId | 404', async (t) => {
    const request = {
        method: 'GET',
        url: `/order/find?refId=unknown`,
        payload: {},
    };

    const res = await server.inject(request);
    t.is(res.statusCode, 404);
});

test('endpoint test | GET /order/find?orderId | 404', async (t) => {
    const request = {
        method: 'GET',
        url: `/order/find?orderId=507f191e810c19729de860ea`,
        payload: {},
    };

    const res = await server.inject(request);
    t.is(res.statusCode, 404);
});

test('endpoint test | GET /order/find?orderId | 400', async (t) => {
    const request = {
        method: 'GET',
        url: `/order/find?orderId=unknown`, // invalid ObjectID
        payload: {},
    };

    const res = await server.inject(request);
    t.is(res.statusCode, 400);
});

test('endpoint test | GET /order/unknown | 404', async (t) => {
    const request = {
        method: 'GET',
        url: '/order/unknown',
        payload: {},
    };

    const res = await server.inject(request);
    t.is(res.statusCode, 404);
});

