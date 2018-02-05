'use strict';

const Glue = require('glue');
const {manifest, options} = require('./manifest');

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
