var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var errors = require('express-api-server').errors;
var validator = require('is-my-json-valid');
var todoSchema = require('./schema').todoSchema;
var validate = validator(todoSchema);
var filter = validator.filter(todoSchema);

var router = module.exports = express.Router();

// create application/x-www-form-urlencoded and JSON parsers
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

router.route('/todos')

    // GET /todos
    .get(function(req, res, next) {
        res.json([
            {id: '1', title: 'Do something', isComplete: true},
            {id: '2', title: 'Do something else', isComplete: false}
        ]);
    })

    // POST /todos
    .post(jsonParser, function(req, res, next) {
        if (!req.body) { return next(new errors.BadRequestError()); }

        // Validate JSON with schema
        var newTodo = filter(req.body);
        if (!validate(newTodo)) {
            return next(new errors.UnprocessableEntityError('Invalid todo resource body', {errors: validate.errors}));
        }

        // ...Save in db...
        newTodo.id = '3';

        res.status(201); // Created
        res.location(getFullBaseUrl(req) + '/todos/' + newTodo.id);
        res.json(newTodo);
    });

router.route('/todos/:todo_id')

    // GET /todos/1
    .get(function(req, res, next) {
        // Unauthorized example
        //return next((new errors.UnauthorizedError()).authBearerHeader());
        res.json({id: '1', title: 'Do something', isComplete: true});
    });

function getFullBaseUrl(req) {
    var fullUrl = req.protocol + '://' + req.get('Host') + req.baseUrl;
    return fullUrl;
}

//function createDbConnection(req, res, next) {
//    r.connect(config.rethinkdb)
//        .then(function(conn) {
//            req._rdbConn = conn;
//            next();
//        }).error(function(err) {
//            next(err);
//        });
//}
//
//function closeDbConnection(req, res, next) {
//    req._rdbConn.close();
//}
