'use strict';

const test = require('ava');
const Joi = require('joi');
const {form, dbOrder} = require('../schema');

test('entity test | dbOrder | ok', async (t) => {
    await Joi.validate({
        _id: '5a7981d8189a28c2d6cae105',
        gateway: 'a',
        refId: '3d7f2d3f-2236-40b4-b095-80119a031cbe',
        customerName: 'Test Mak',
        customerPhone: '88888888',
        currency: 'HKD',
        price: 100.1,
    }, dbOrder);
    t.pass();
});

test('entity test | form | ok', async (t) => {
    await Joi.validate({
        order: {
            customerName: 'Test Mak',
            customerPhone: '88888888',
            currency: 'HKD',
            price: 100.1,
        },
        payment: {
            name: 'Test Mak',
            number: '378282246310005',
            expiration: '2000/01',
            ccv: '123',
        },
    }, form);
    t.pass();
});

test('entity test | form | ok 2', async (t) => {
    await Joi.validate({
        order: {
            customerName: 'Testfdsafdsfadsdfdsa Makdsafdsafdsafdsa',
            customerPhone: '66666666',
            currency: 'USD',
            price: 3425325.1,
        },
        payment: {
            name: 'Testdsafdsafdsafdsadfs dasfdsafdasfdasMak',
            number: '5610591081018250', // Australian BankCard
            expiration: '2000/01',
            ccv: '123',
        },
    }, form);
    t.pass();
});

test('entity test | form | ok 3', async (t) => {
    await Joi.validate({
        order: {
            customerName: 'Test. Mak,',
            customerPhone: '85288888888',
            currency: 'USK',
            price: 99999.19,
        },
        payment: {
            name: 'Test. Mak,',
            number: '378282246310005',
            expiration: '9999/01',
            ccv: 'abc',
        },
    }, form);
    t.pass();
});

test('entity test | form | wrong price min', async (t) => {
    try {
        await Joi.validate({
            order: {
                customerName: 'Test Mak',
                customerPhone: '88888888',
                currency: 'HKD',
                price: -1,
            },
            payment: {
                name: 'Test Mak',
                number: '378282246310005',
                expiration: '2000/01',
                ccv: '123',
            },
        }, form);
        t.fail('should throw err');
    } catch (err) {
        t.pass();
    }
});

test('entity test | form | wrong price precision', async (t) => {
    try {
        await Joi.validate({
            order: {
                customerName: 'Test Mak',
                customerPhone: '88888888',
                currency: 'HKD',
                price: 10.000101,
            },
            payment: {
                name: 'Test Mak',
                number: '378282246310005',
                expiration: '2000/01',
                ccv: '123',
            },
        }, form);
        t.fail('should throw err');
    } catch (err) {
        t.pass();
    }
});

test('entity test | form | wrong price max', async (t) => {
    try {
        await Joi.validate({
            order: {
                customerName: 'Test Mak',
                customerPhone: '88888888',
                currency: 'HKD',
                price: 10000000000,
            },
            payment: {
                name: 'Test Mak',
                number: '378282246310005',
                expiration: '2000/01',
                ccv: '123',
            },
        }, form);
        t.fail('should throw err');
    } catch (err) {
        t.pass();
    }
});

test('entity test | form | wrong card number', async (t) => {
    try {
        await Joi.validate({
            order: {
                customerName: 'Test Mak',
                customerPhone: '88888888',
                currency: 'HKD',
                price: 100.1,
            },
            payment: {
                name: 'Test Mak',
                number: 'unknown',
                expiration: '2000/01',
                ccv: '123',
            },
        }, form);
        t.fail('should throw err');
    } catch (err) {
        t.pass();
    }
});

test('entity test | form | wrong ccv', async (t) => {
    try {
        await Joi.validate({
            order: {
                customerName: 'Test Mak',
                customerPhone: '88888888',
                currency: 'HKD',
                price: 100.1,
            },
            payment: {
                name: 'Test Mak',
                number: '378282246310005',
                expiration: '2000/01',
                ccv: '1234',
            },
        }, form);
        t.fail('should throw err');
    } catch (err) {
        t.pass();
    }
});

test('entity test | form | wrong ccv2', async (t) => {
    try {
        await Joi.validate({
            order: {
                customerName: 'Test Mak',
                customerPhone: '88888888',
                currency: 'HKD',
                price: 100.1,
            },
            payment: {
                name: 'Test Mak',
                number: '378282246310005',
                expiration: '2000/01',
                ccv: '12',
            },
        }, form);
        t.fail('should throw err');
    } catch (err) {
        t.pass();
    }
});

test('entity test | form | wrong expiry', async (t) => {
    try {
        await Joi.validate({
            order: {
                customerName: 'Test Mak',
                customerPhone: '88888888',
                currency: 'HKD',
                price: 100.1,
            },
            payment: {
                name: 'Test Mak',
                number: '378282246310005',
                expiration: '01/2000',
                ccv: '123',
            },
        }, form);
        t.fail('should throw err');
    } catch (err) {
        t.pass();
    }
});

test('entity test | form | wrong name', async (t) => {
    try {
        await Joi.validate({
            order: {
                customerName: 'Test_Mak',
                customerPhone: '88888888',
                currency: 'HKD',
                price: 100.1,
            },
            payment: {
                name: 'Test Mak',
                number: '378282246310005',
                expiration: '2000/10',
                ccv: '123',
            },
        }, form);
        t.fail('should throw err');
    } catch (err) {
        t.pass();
    }
});

test('entity test | form | wrong name 2', async (t) => {
    try {
        await Joi.validate({
            order: {
                customerName: 'Test Mak',
                customerPhone: '88888888',
                currency: 'HKD',
                price: 100.1,
            },
            payment: {
                name: 'Test_Mak',
                number: '378282246310005',
                expiration: '2000/10',
                ccv: '123',
            },
        }, form);
        t.fail('should throw err');
    } catch (err) {
        t.pass();
    }
});

test('entity test | form | wrong phone', async (t) => {
    try {
        await Joi.validate({
            order: {
                customerName: 'Test Mak',
                customerPhone: '8888_8888',
                currency: 'HKD',
                price: 100.1,
            },
            payment: {
                name: 'Test Mak',
                number: '378282246310005',
                expiration: '2000/10',
                ccv: '123',
            },
        }, form);
        t.fail('should throw err');
    } catch (err) {
        t.pass();
    }
});