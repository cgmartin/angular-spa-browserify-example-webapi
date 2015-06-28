'use strict';

var r = require('../lib/rdb');

exports.getUsers = function(limit, index) {
    limit = parseInt(limit || 20);
    index = parseInt(index || 0);
    return r.table('users').slice(index, limit).run();
};

exports.getUser = function(id) {
    return r.table('users').get(id).run();
};

exports.findUserByEmail = function(email) {
    return r.table('users')
        .getAll(email, {index: 'email'})
        .run()
        .then(function(result) {
            return (result && result.length > 0) ? result[0] : null;
        });
};
