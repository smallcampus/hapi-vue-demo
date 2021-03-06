'use strict';

const Boom = require('boom');
const schemaForm = require('../schema').form;
const schemaDbOrder = require('../schema').dbOrder;
const Joi = require('joi');
const winston = require('winston');

exports.register = function(server, options) {
    const ObjectID = server.mongo.ObjectID;

    // ==== Cache ==========================
    const getOrderById = async (orderId)=> {
        let id;
        try {
            id = new ObjectID(orderId);
        } catch (err) {
            throw Boom.badRequest('invalid objectID');
        }
        winston.debug('getOrderById hit db');
        return await server.mongo.db.collection('orders')
            .tryFindOne({_id: id});
    };
    server.method('getOrderById', getOrderById, {
        cache: {
            expiresIn: 30 * 1000,
            generateTimeout: 100,
        },
    });
    const getOrderByRefId = async (refId, customerName)=> {
        winston.debug('getOrderByRefId hit db');
        return await server.mongo.db.collection('orders')
            .tryFindOne({refId: refId, customerName: customerName});
    };
    server.method('getOrderByRefId', getOrderByRefId, {
        cache: {
            expiresIn: 30 * 1000,
            generateTimeout: 100,
        },
    });

    // ==== Other ============================
    const defaultValidateFailAction = async (request, h, err) => {
        if (process.env.NODE_ENV === 'production') {
            // In prod, log a limited error message and throw the
            // default Bad Request error.
            winston.error('ValidationError:', err.message);
            throw Boom.badRequest(`Invalid request payload input`);
        } else {
            // During development, log and respond with the full error.
            winston.error(err);
            throw err;
        }
    };

    // Create order
    server.route({
        method: 'POST',
        path: '/order/create',
        async handler(request) {
            const db = request.mongo.db;
            const reqOrder = request.payload.order;
            const payment = request.payload.payment;

            const gateway = server.methods.getPaymentGateway(reqOrder, payment);

            if (!gateway) {
                throw Boom.badRequest('unsupported gateway');
            }

            // Assume every request is a new order
            // Two phrase commit
            reqOrder.status = 'pending';
            let resultFirst = await db.collection('orders')
                .insertMany([
                    reqOrder,
                ])
                .catch((err)=>{
                    throw Boom.internal('Internal MongoDB error', err);
                });
            let dbOrder = resultFirst.ops[0];

            // Create charge in payment gateway
            let resultPayment = await gateway.proceed(dbOrder, payment);

            dbOrder = Object.assign(dbOrder, resultPayment);
            dbOrder.status = 'charged';

            // Commit order transaction
            let resultSecond = await db.collection('orders')
                .findOneAndUpdate({_id: dbOrder._id, status: 'pending'}, dbOrder)
                .catch((err)=>{
                    throw Boom.internal('Internal MongoDB error', err);
                });
            if (!resultSecond) {
                console.error('invalid order status', dbOrder);
                throw Boom.internal('invalid order status', dbOrder);
            }

            return dbOrder;
        },
        config: {
            validate: {
                failAction: defaultValidateFailAction,
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
            const refId = request.query.refId;
            const customerName = request.query.customerName;
            return await server.methods.getOrderByRefId(refId,
                customerName);
        },
        config: {
            tags: ['api'], // Swagger
            notes: 'Either refId or orderId should be provided',
            validate: {
                // failAction: defaultValidateFailAction,
                query: {
                    refId: Joi.string().required()
                        .description('refId'),
                    customerName: Joi.string().required()
                        .description('customerName'),
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
