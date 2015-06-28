// jshint -W079, -W069
'use strict';
/**
 * Auth Service using JSON Web Tokens (JWT)
 * https://stormpath.com/blog/token-auth-spa/
 * http://stackoverflow.com/questions/3487991/why-does-oauth-v2-have-both-access-and-refresh-tokens/12885823#12885823
 * http://blog.matoski.com/articles/jwt-express-node-mongoose/
 * http://knowthen.com/episode-9-ditching-cookies-for-json-web-tokens/
 * http://www.digitalsyncretism.com/blog/token-authentication-the-practice/
 *
 * OAUTH2 Design
 * https://aaronparecki.com/articles/2012/07/29/1/oauth2-simplified
 * https://github.com/t1msh/node-oauth20-provider
 * http://oauth.net/2/
 */
var expressApiServer = require('express-api-server');
var errors = expressApiServer.errors;
var config = require('../config');
var jwt = require('jsonwebtoken');
var userDal = require('../data/user-data');
var refreshTokenDal = require('../data/refresh-token-data');
var uuid = require('uuid');
var Promise = require('bluebird');
var hashPassword = Promise.promisify(require('../lib/hash-password'));
var createTokenBodyValidator = require('../validators/create-token-body-validator');
var refreshTokenBodyValidator = require('../validators/refresh-token-body-validator');

/**
 * Authenticate with username/password to retrieve a JWT
 *
 * Also creates a refresh token that can be used to extend the authentication
 * session after it expires.
 */
exports.createToken = function(req, res, next) {
    if (!req.body) { return next(new errors.BadRequestError()); }

    // Validate JSON with schema
    var reqBody = createTokenBodyValidator.filter(req.body);
    if (!createTokenBodyValidator.validate(reqBody)) {
        req.log.error('Invalid access token body'); // Bunyan logger available on req
        return next(new errors.UnprocessableEntityError(
            'Invalid access token body', {errors: createTokenBodyValidator.validate.errors}
        ));
    }

    findUserByUsername(reqBody.username)
        .then(checkPasswordMatch)
        .then(generateRefreshToken(req))
        .spread(generateAccessToken(req))
        .spread(sendTokenResponse(res))
        .catch(handleError('auth create token', req, next));

    function findUserByUsername(username) {
        return userDal
            .findUserByEmail(username)
            .then(function(user) {
                if (!user) {  // Username not found
                    return Promise.reject(new errors.BadRequestError('Authentication failed'));
                }
                return user; // user
            });
    }

    function checkPasswordMatch(user) {
        return hashPassword(reqBody.password, user.salt)
            .then(function(hash) {
                if (hash !== user.password) { // Password does not match
                    return Promise.reject(new errors.BadRequestError('Authentication failed'));
                }
                return user;
            });
    }
};

/**
 * Refresh the JWT token after it has expired
 *
 * When the user first authenticates, a refresh token is created to allow extending the
 * session without having to supply credentials.
 */
exports.refreshToken = function(req, res, next) {
    if (!req.jwtData.user || !req.jwtData.user.id) {
        return next(new errors.UnauthorizedError('Authentication failed'));
    }

    if (!req.body) { return next(new errors.BadRequestError()); }

    // Validate JSON with schema
    var reqBody = refreshTokenBodyValidator.filter(req.body);
    if (!refreshTokenBodyValidator.validate(reqBody)) {
        req.log.error('Invalid refresh token body'); // Bunyan logger available on req
        return next(new errors.UnprocessableEntityError(
            'Invalid refresh token body', {errors: refreshTokenBodyValidator.validate.errors}
        ));
    }

    getRefreshTokenData(reqBody.refreshToken)
        .then(getUserData)
        .then(generateRefreshToken(req))
        .spread(generateAccessToken(req))
        .spread(sendTokenResponse(res))
        .catch(handleError('auth refresh token', req, next));

    function getRefreshTokenData(refreshToken) {
        return refreshTokenDal.getRefreshToken(refreshToken)
            .then(function(refreshTokenData) {
                if (!refreshTokenData) {  // Refresh token data not found
                    return Promise.reject(new errors.BadRequestError('Refresh token not found'));
                }
                if (refreshTokenData.userId !== req.jwtData.user.id) { // User must match
                    return Promise.reject(new errors.BadRequestError('Refresh token not found'));
                }
                return refreshTokenData;
            });
    }

    function getUserData(refreshTokenData) {
        return userDal
            .getUser(refreshTokenData.userId)
            .then(function(user) {
                if (!user) {
                    return Promise.reject(new errors.UnauthorizedError('User not found'));
                }
                return user; // user
            });
    }
};

function generateRefreshToken(req) {
    return function(user) {
        var refreshToken = uuid.v4();

        // Save refresh token asynchronously, don't need to wait
        refreshTokenDal.saveRefreshToken(
            refreshToken, user.id, 'browser', config.jwt.refreshExpiresInMinutes
        ).catch(function(err) {
            req.log.error({error: err}, 'save refresh token error');
        });

        return [user, refreshToken];
    };
}

function generateAccessToken(req) {
    return function(user, refreshToken) {

        var originalIat = null;
        if (req.jwtData) {
            originalIat = req.jwtData['original_iat'] || req.jwtData.iat;
        }

        // Sign token
        var token = jwt.sign({
            id:   uuid.v4(),
            'original_iat': originalIat,
            user: {
                id:    user.id,
                name:  user.name,
                roles: ['admin'] // TODO
            }
        }, config.jwt.secret, config.jwt.opts);

        return [token, refreshToken];
    };
}

function sendTokenResponse(res) {
    return function(token, refreshToken) {
        res.json({
            token:        token,
            refreshToken: refreshToken,
            expires:      config.jwt.opts.expiresInMinutes * 60 * 1000
        });
    };
}

function handleError(msgLabel, req, next) {
    return function(err) {
        if (!(err instanceof errors.HttpError)) {
            req.log.error({error: err}, msgLabel + ' error');
            err = new errors.InternalServerError('Internal error', {cause: err});
        }
        return next(err);
    };
}
