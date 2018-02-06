'use strict';

const Gateway = require('../util/payment-gateway');
const Boom = require('boom');
const schemaForm = require('../schema').form;

exports.register = function(server, options) {
    // Create order
    server.route({
        method: 'POST',
        path: '/order/create',
        async handler(request) {
            const db = request.mongo.db;
            const reqOrder = request.payload.order;
            const payment = request.payload.payment;

            const gateway = Gateway.getPaymentGateway(reqOrder, payment);

            let result = await gateway.proceed(reqOrder, payment);
            let order = Object.assign(result, reqOrder);
            let dbResult = await db.collection('orders')
                .insertMany([
                    order,
                ])
                .catch((err)=>{
                    throw Boom.internal('Internal MongoDB error', err);
                });
            return dbResult.ops[0];
        },
        config: {
            validate: {
                payload: schemaForm,
            },
        },
    });
    // Get order
    server.route({
        method: 'GET',
        path: '/order/find',
        async handler(request) {
            const db = request.mongo.db;
            const ObjectID = request.mongo.ObjectID;
            const refId = request.query.refId;
            const orderId = request.query.orderId;
            if (!refId && !orderId) {
                throw Boom.badRequest('missing param refId or orderId');
            }
            if (refId && orderId) {
                throw Boom.badRequest('either param refId or orderId');
            }
            if (refId) {
                return await db.collection('orders')
                    .tryFindOne({refId: refId});
            }
            if (orderId) {
                let id;
                try {
                     id = new ObjectID(orderId);
                } catch (err) {
                    throw Boom.badRequest('invalid objectID');
                }
                return await db.collection('orders')
                    .tryFindOne({_id: id});
            }

            throw Boom.internal('Internal error');
        },
    });
};

exports.name = 'order-api';
exports.multiple = true;
