'use strict';

var validator = require('is-my-json-valid');

var schema = {
    name: 'createTokenBody',
    type: 'object',
    additionalProperties: false,
    required: ['clientId', 'username', 'password'],
    properties: {
        clientId: { type: 'string', oneOf: ['browser'] },
        username: { type: 'string', maxLength: 255 },
        password: { type: 'string', maxLength: 255 }
    }
};

module.exports = {
    validate: validator(schema),
    filter: validator.filter(schema)
};
