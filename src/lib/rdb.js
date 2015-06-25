'use strict';

var config = require('../config');

// connect to localhost:8080, and let the driver find other instances
module.exports = require('rethinkdbdash')({
    // database
    db: config.rethinkDb.db,

    // connect to localhost:8080, and let the driver find other instances
    discovery: false,

    // Connect to a cluster seeding from `192.168.0.100`, `192.168.0.100`, `192.168.0.102`
    //servers: [
    //    {host: '192.168.0.100', port: 28015},
    //    {host: '192.168.0.101', port: 28015},
    //    {host: '192.168.0.102', port: 28015},
    //],
    servers: config.rethinkDb.connection.split(',').map(function(server) {
        var hostPort = server.split(':');
        return {
            host: hostPort[0],
            port: hostPort[1]
        };
    }),

    // Minimum number of connections available in the pool
    buffer: config.rethinkDb.minConnections,

    // Maximum number of connections available in the pool
    max: config.rethinkDb.maxConnections
});
