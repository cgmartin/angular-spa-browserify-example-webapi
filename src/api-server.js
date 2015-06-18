'use strict';
var path = require('path');
var throng = require('throng');
var apiServer = require('express-api-server');

function start() {
    // express-api-server option overrides
    var serverOptions = {
        baseUrlPath: '/api',
        sslKeyFile:  path.join(__dirname, '/keys/60638403-localhost.key'),
        sslCertFile: path.join(__dirname, '/keys/60638403-localhost.cert'),
        cors: {}
    };

    var appInitCb = function(app, options) {
        // Set up additional middleware here, such as rate limiting, db connection, etc...

        // Attach our api resource routes
        app.use(options.baseUrlPath, [
            require('./resources/logs'),
            require('./resources/todos')
        ]);
    };
    apiServer.start(appInitCb, serverOptions);
}

throng(start, {
    workers: process.env.WEB_CONCURRENCY,
    lifetime: Infinity
});

// Use environment variables for other options:
//   NODE_ENV=production STATIC_SSL=1 STATIC_PORT=443 node example/start.js
