'use strict';

var crypto = require('crypto');

module.exports = hashPassword;

function hashPassword(password, salt, cb) {
    var iterations = 4096;
    var keylen = 512;
    var digest = 'sha256';

    if (arguments.length === 3) { // Salt provided
        crypto.pbkdf2(password, salt, iterations, keylen, digest, function(err, hash) {
            if (err) { return cb(err); }
            cb(null, hash.toString('base64'));
        });
    } else {
        cb = salt; // No salt
        crypto.randomBytes(keylen, function(err, salt) {
            if (err) { return cb(err); }
            salt = salt.toString('base64');
            crypto.pbkdf2(password, salt, iterations, keylen, digest, function(err, hash) {
                if (err) { return cb(err); }
                cb(null, salt, hash.toString('base64'));
            });
        });
    }
}
