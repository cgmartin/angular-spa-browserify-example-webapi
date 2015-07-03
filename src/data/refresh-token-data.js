'use strict';

var r = require('../lib/rdb');

exports.getRefreshToken = function(token) {
    return r.table('refreshTokens')
        .getAll(token, {index: 'id'})
        .filter(r.row('expires') > r.now())
        .run()
        .then(function(result) {
            return (result && result.length > 0) ? result[0] : null;
        });
};

exports.removeByUserIdClientId = function(userId, clientId) {
    return r.table('refreshTokens')
        .getAll([userId, clientId], {index: 'user_client'})
        .delete()
        .run();
};

exports.removeRefreshToken = function(token) {
    return r.table('refreshTokens')
        .get(token)
        .delete()
        .run();
};

exports.saveRefreshToken = function(token, userId, clientId, expiresMin) {
    var expires = r.now().add(expiresMin * 60);
    return exports.removeByUserIdClientId(userId, clientId)
        .then(function(result) {
            return r.table('refreshTokens')
                .insert({id: token, userId: userId, clientId: clientId, expires: expires})
                .run();
        });
};
