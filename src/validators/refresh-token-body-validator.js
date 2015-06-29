'use strict';
// http://json-schema.org/example2.html
var validator = require('is-my-json-valid');

var schema = {
    name: 'refreshTokenBody',
    type: 'object',
    additionalProperties: false,
    required: ['refreshToken'],
    properties: {
        refreshToken: { type: 'string', maxLength: 255 }
    }
};

module.exports = {
    validate: validator(schema),
    filter: validator.filter(schema)
};
