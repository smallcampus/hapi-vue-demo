'use strict';

const Boom = require('boom');

exports.register = function(server, options) {
    const Mongo = server.mongo.lib;

    // ==== Mongo Extension functions ==================
    Object.defineProperty(Mongo.Collection.prototype, 'tryFindOne', {
        value: async function(query, options) {
            let result;
            try {
                result = await this.findOne(query, options);
            } catch (err) {
                throw Boom.internal('Internal MongoDB error', err);
            }

            if (!result) {
                throw Boom.notFound('order not found');
            }

            return result;
        }});
};

exports.name = 'mongo-extension';
exports.multiple = true;
