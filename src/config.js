'use strict';

var path = require('path');

module.exports = {
    // A base URL path prefix, i.e. "/api"
    baseUrlPath: process.env.API_BASE_URL || '/api',

    // Use throng to cluster the processes across CPUs
    useCluster: process.env.API_USE_CLUSTER || false,

    // Enable heapdump support
    heapdumpEnabled: (process.env.STATIC_HEAPDUMP === '1'),

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
        secret: process.env.API_JWT_SECRET || 'a8265adf-941c-4d6e-b28b-8fa9318bcae7',
        opts: {
            expiresInMinutes: 5
        },
        refreshExpiresInMinutes: 10080 // 1 week
    },

    // Crypto Hash Options
    crypto: {
        iterations: parseInt(process.env.API_HASH_ITERATIONS || 4096),
        keylen: parseInt(process.env.API_HASH_KEYLEN || 512),
        digest: 'sha256'
    }
};

