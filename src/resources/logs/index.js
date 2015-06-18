var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var errors = require('express-api-server').errors;

var router = module.exports = express.Router();

// create parsers for application/x-www-form-urlencoded and JSON content types
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json({limit: '200kb'});

router.route('/logs')

    // POST /logs
    .post(jsonParser, function(req, res, next) {
        if (!req.body) { return next(new errors.BadRequestError()); }

        var logBundle = req.body;
        var logs = logBundle.logs;
        delete logBundle.logs;

        logs.forEach(function(log) {
            req.log.info({ clientLog: _.merge(log, logBundle).valueOf() }, 'client log');
        });
        res.end();
    });
