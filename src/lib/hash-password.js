'use strict';

var crypto = require('crypto');

module.exports = function(config) {
    config = config || {};
    var iterations = config.iterations || 4096;
    var keylen = config.keylen || 512;
    var digest = config.digest || 'sha256';

    return hashPassword;

    function hashPassword(password, salt, cb) {
        if (arguments.length < 3) {
            cb = salt;
            return createSalt(function(err, salt) {
                if (err) { return cb(err); }
                hashPassword(password, salt, cb);
            });
        }

        crypto.pbkdf2(password, salt, iterations, keylen, digest, function(err, hash) {
            if (err) { return cb(err); }
            cb(null, hash.toString('base64'));
        });
    }

    function createSalt(cb) {
        crypto.randomBytes(keylen, function(err, salt) {
            if (err) { return cb(err); }
            cb(null, salt.toString('base64'));
        });
    }
};

