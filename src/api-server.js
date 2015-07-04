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
        cors: {},
        isGracefulShutdownEnabled: false
    };

    // Attach our api resource routes
    var initApiRoutes = function(app, options) {
        app.use(options.baseUrlPath, require('./routes'));
    };

    // Start the api server
    apiServer.start(initApiRoutes, serverOptions);
}

throng(start, {
    workers: process.env.WEB_CONCURRENCY || 1,
    lifetime: Infinity
});

// Use environment variables for other options:
//   NODE_ENV=production STATIC_SSL=1 STATIC_PORT=443 node example/start.js
