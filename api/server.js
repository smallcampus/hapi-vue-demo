'use strict';

const Glue = require('glue');
const {manifest, options} = require('./manifest');

const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');

const swaggerOptions = {
    info: {
        title: 'API Documentation',
        version: '1.0',
    },
};

manifest.register.plugins.push({plugin: Inert});
manifest.register.plugins.push({plugin: Vision});
manifest.register.plugins.push({
    plugin: HapiSwagger,
    options: swaggerOptions,
});

const startServer = async function() {
    try {
        const server = await Glue.compose(manifest, options);
        await server.start();
        console.log(`Server started at ${server.info.uri}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();
