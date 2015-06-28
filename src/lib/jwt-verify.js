// jshint -W016
'use strict';
/**
 * Modified from https://github.com/auth0/express-jwt
 */
var jwt = require('jsonwebtoken');
var UnauthorizedError = require('express-api-server').errors.UnauthorizedError;
var _ = require('lodash');
var async = require('async');

var DEFAULT_REVOKED_FUNCTION = function(_, __, cb) { return cb(null, false); };

function wrapStaticSecretInCallback(secret) {
    return function(_, __, cb) {
        return cb(null, secret);
    };
}

module.exports = function(options) {
    if (!options || !options.secret) { throw new Error('secret should be set'); }

    var secretCallback = options.secret;

    if (!_.isFunction(secretCallback)) {
        secretCallback = wrapStaticSecretInCallback(secretCallback);
    }

    var isRevokedCallback = options.isRevoked || DEFAULT_REVOKED_FUNCTION;

    var _requestProperty = options.userProperty || options.requestProperty || 'jwtData';
    var credentialsRequired = typeof options.credentialsRequired === 'undefined' ? true : options.credentialsRequired;

    return function middleware(req, res, next) {
        var token;

        if (req.method === 'OPTIONS' && req.headers.hasOwnProperty('access-control-request-headers')) {
            var hasAuthInAccessControl = !!~req.headers['access-control-request-headers']
                .split(',').map(function(header) {
                    return header.trim();
                }).indexOf('authorization');

            if (hasAuthInAccessControl) {
                return next();
            }
        }

        if (options.getToken && typeof options.getToken === 'function') {
            try {
                token = options.getToken(req);
            } catch (e) {
                return next(e);
            }
        } else if (req.headers && req.headers.authorization) {
            var parts = req.headers.authorization.split(' ');
            if (parts.length === 2) {
                var scheme = parts[0];
                var credentials = parts[1];

                if (/^Bearer$/i.test(scheme)) {
                    token = credentials;
                } else {
                    return next(
                        new UnauthorizedError(
                            'Format is Authorization: Bearer [token]', {code: 'credentials_bad_scheme'}
                        ));
                }
            } else {
                return next(
                    new UnauthorizedError(
                        'Format is Authorization: Bearer [token]', {code: 'credentials_bad_format'}
                    ));
            }
        }

        if (!token) {
            if (credentialsRequired) {
                return next(
                    new UnauthorizedError(
                        'No authorization token was found', {code: 'credentials_required'}
                    ));
            } else {
                return next();
            }
        }

        var dtoken = jwt.decode(token, { complete: true }) || {};

        async.parallel([
            function(callback) {
                var arity = secretCallback.length;
                if (arity === 4) {
                    secretCallback(req, dtoken.header, dtoken.payload, callback);
                } else { // arity == 3
                    secretCallback(req, dtoken.payload, callback);
                }
            },
            function(callback) {
                isRevokedCallback(req, dtoken.payload, callback);
            }
        ], function(err, results) {
            if (err) { return next(err); }
            var revoked = results[1];
            if (revoked) {
                return next(
                    new UnauthorizedError(
                        'The token has been revoked', {code: 'revoked_token'}
                    ));
            }

            var secret = results[0];

            jwt.verify(token, secret, options, function(err, decoded) {
                if (err && credentialsRequired) {
                    return next(
                        new UnauthorizedError(
                            err.message, {code: 'invalid_token', cause: err}
                        ));
                }

                req[_requestProperty] = decoded;
                next();
            });
        });
    };
};
