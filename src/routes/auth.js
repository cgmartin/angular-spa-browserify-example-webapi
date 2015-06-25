'use strict';

var express = require('express');
var jsonParser = require('body-parser').json();
var expressApiServer = require('express-api-server');
var errors = expressApiServer.errors;
var getFullBaseUrl = expressApiServer.getFullBaseUrl;
var validator = require('is-my-json-valid');
var config = require('../config');
var jwt = require('jsonwebtoken');
var jwtVerify = require('../lib/jwt-verify')({secret: config.jwt.secret});
var userSvc = require('../services/user-service');
var uuid = require('uuid');

var router = module.exports = express.Router();
//
// Route Definitions
// -----------------------------------------------------------------

router.route('/auth/tokens')
    .post(jsonParser, createToken)             // POST /auth/tokens
    .put(jsonParser, jwtVerify, updateToken);  // PUT /auth/tokens

//
// Route Actions
// -----------------------------------------------------------------

var createTokenSchema = {
    name: 'createToken',
    type: 'object',
    additionalProperties: false,
    required: ['username', 'password'],
    properties: {
        username: { type: 'string', maxLength: 255 },
        password: { type: 'string', maxLength: 255 }
    }
};
var validateCreateToken = validator(createTokenSchema);
var filterCreateToken = validator.filter(createTokenSchema);

/**
 * Authenticate with username/password to retrieve a JWT
 */
function createToken(req, res, next) {
    if (!req.body) { return next(new errors.BadRequestError()); }

    // Validate JSON with schema
    var createTokenBody = filterCreateToken(req.body);
    if (!validateCreateToken(createTokenBody)) {
        req.log.error('Invalid create token body'); // Bunyan logger available on req
        return next(new errors.UnprocessableEntityError(
            'Invalid create token body', {errors: validateCreateToken.errors}
        ));
    }

    // Find user by username, or 401 Authentication failed
    userSvc.findUserByEmail(createTokenBody.username)
        .then(authenticateUser)
        .error(handleDbError(next));

    function authenticateUser(result) {
        if (!result || result.length === 0) {
            return next(new errors.UnauthorizedError('Authentication failed'));
        }

        var user = result[0];
        // TODO: Compare password, or 401 Authentication failed
        console.log('USER:', user);

        // Sign token
        var token = jwt.sign({
            id: uuid.v4(),
            user: {
                id: user.id,
                name: user.name,
                roles: ['admin']
            }
        }, config.jwt.secret, config.jwt.opts);

        res.json({token: token});
    }
}

/**
 * Refresh the token before it expires
 *
 * http://stackoverflow.com/questions/26739167/jwt-json-web-token-automatic-prolongation-of-expiration
 *
 * "Set the token expiration to one week and refresh the token every time
 * the user open the web application and every one hour. If a user doesn't
 * open the application for more than a week, they will have to login again..."
 */
function updateToken(req, res, next) {
    if (!req.jwtData.user || !req.jwtData.user.id) {
        return next(new errors.UnauthorizedError('Authentication failed'));
    }

    // req.jwtData via jwtVerify middleware
    userSvc.getUser(req.jwtData.user.id)
        .then(refreshToken)
        .error(handleDbError(next));

    function refreshToken(user) {
        if (!user) {
            return next(new errors.UnauthorizedError('Authentication failed'));
        }

        // Get original iat
        var originalIat = req.jwtData['original_iat'] || req.jwtData.iat;

        var token = jwt.sign({
            id: uuid.v4(),
            'original_iat': originalIat,
            user: {
                id: user.id,
                name: user.name,
                roles: ['admin']
            }
        }, config.jwt.secret, config.jwt.opts);

        res.json({token: token});
    }
}

function handleDbError(next) {
    return function(err) {
        next(new errors.InternalServerError('Database error', {cause: err}));
    };
}
