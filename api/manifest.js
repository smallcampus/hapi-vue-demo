'use strict';

const manifest = {
    server: {
        host: 'localhost',
        port: 8000,
    },
    register: {
        plugins: [
            {
                plugin: require('hapi-mongodb'),
                options: {
                    url: 'mongodb://localhost:27017/test',
                    settings: {
                        poolSize: 10,
                    },
                    decorate: true,
                }},
            {
                plugin: require('./plugin/mongo-extension'),
            },
            {
                plugin: require('./plugin/order-api'),
            },
        ],
    },
};

const options = {};

exports.manifest = manifest;
exports.options = options;
