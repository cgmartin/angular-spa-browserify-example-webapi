var _ = require('lodash');
var errors = require('express-api-server').errors;

exports.createLog = function(req, res, next) {
    if (!req.body) { return next(new errors.BadRequestError()); }

    var logBundle = req.body;
    var logs = logBundle.logs;
    delete logBundle.logs;

    logs.forEach(function(log) {
        req.log.info({ clientLog: _.merge(log, logBundle).valueOf() }, 'client log');
    });
    res.end();
};
