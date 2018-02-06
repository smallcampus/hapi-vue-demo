'use strict';

const Gateway = require('../util/payment-gateway');
const Boom = require('boom');
const schemaForm = require('../schema').form;
const schemaDbOrder = require('../schema').dbOrder;
const Joi = require('joi');

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
            tags: ['api'], // Swagger
            response: {
                failAction: async (request, h, err) => {
                    console.log(err);
                    throw err;
                },
                // sample: 0, //REVIEW Performance / Documentation
                schema: schemaDbOrder,
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
        config: {
            tags: ['api'], // Swagger
            notes: 'Either refId or orderId should be provided',
            validate: {
                query: {
                    refId: Joi.string()
                        .description('refId'),
                    orderId: Joi.string()
                        .description('orderId'),
                },
            },
            response: {
                failAction: async (request, h, err) => {
                    console.log(err);
                    throw err;
                },
                // sample: 0, //REVIEW Performance / Documentation
                schema: schemaDbOrder,
            },
        },
    });
};

exports.name = 'order-api';
exports.multiple = true;
