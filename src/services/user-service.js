'use strict';

var r = require('../lib/rdb');

module.exports = {
    getUsers: getUsers,
    getUser: getUser,
    findUserByEmail: findUserByEmail
};

function getUsers(limit, index) {
    limit = parseInt(limit || 20);
    index = parseInt(index || 0);
    return r.table('users').slice(index, limit).run();
}

function getUser(id) {
    return r.table('users').get(id).run();
}

function findUserByEmail(email) {
    return r.table('users').filter({email: email}).run();
}
