'use strict';
var path = require('path');
var throng = require('throng');
var apiServer = require('express-api-server');
var config = require('./config');

// Use environment variables for other options:
//   NODE_ENV=production API_SSL=1 API_PORT=443 node src/api-server.js

if (config.heapdumpEnabled) {
    // To generate a heapdump on the running process, send: `kill -USR2 {pid}`
    require('heapdump');
}

if (config.useCluster) {
    throng(start, {
        workers:  process.env.WEB_CONCURRENCY || 1,
        lifetime: Infinity
    });
} else {
    start();
}

function start() {
    // Attach our api resource routes
    var initApiRoutes = function(app, options) {
        app.get(options.baseUrlPath + '/status', function(req, res) {
            req.skipRequestLog = true;
            res.json({status: 'OK'});
        });

        app.use(options.baseUrlPath, require('./routes'));
    };

    // Start the api server
    apiServer.start(initApiRoutes, config);
}
