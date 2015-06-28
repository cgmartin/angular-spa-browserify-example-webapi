'use strict';

var path = require('path');

module.exports = {
    // A base URL path prefix, i.e. "/api"
    baseUrlPath: process.env.API_BASE_URL || '/api',

    rethinkDb: {
        // Database name
        db: process.env.API_RDB_DB || 'spa',

        // Database connection string (comma-separated list)
        connection: process.env.API_RDB_CONN || '127.0.0.1:28015',

        // Minimum number of connections available in the pool
        minConnections: process.env.API_RDB_POOL_MIN || 50,

        // Maximum number of connections available in the pool
        maxConnections: process.env.API_RDB_POOL_MAX || 1000
    },

    // HTTPS key/cert file paths
    sslKeyFile:  process.env.API_SSL_KEY  || path.join(__dirname, '/keys/60638403-localhost.key'),
    sslCertFile: process.env.API_SSL_CERT || path.join(__dirname, '/keys/60638403-localhost.cert'),

    // Cross-site HTTP requests
    // https://github.com/expressjs/cors#configuring-cors
    cors: {},

    // JWT Options
    jwt: {
        secret: 'a8265adf-941c-4d6e-b28b-8fa9318bcae7',
        opts: {
            expiresInMinutes: 5
        },
        refreshExpiresInMinutes: 10080 // 1 week
    }
};

