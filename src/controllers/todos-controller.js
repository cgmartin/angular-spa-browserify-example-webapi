'use strict';
/**
 * Example express router for "todo" resources
 */
var expressApiServer = require('express-api-server');
var errors = expressApiServer.errors;
var getFullBaseUrl = expressApiServer.getFullBaseUrl;
var validator = require('is-my-json-valid');

exports.retrieveTodoList = function(req, res, next) {
    //process.nextTick(function() {
    //    throw new Error('OH NOES!');
    //});
    //// ...Retrieve from backend...
    var todos = [
        {id: 1, title: 'Do something', isComplete: true},
        {id: 2, title: 'Do something else', isComplete: false}
    ];
    res.json(todos);
};

var todoSchema = {
    name: 'todo',
    type: 'object',
    additionalProperties: false,
    required: ['title'],
    properties: {
        id:         { type: 'string', maxLength: 64 },
        title:      { type: 'string', maxLength: 255 },
        isComplete: { type: 'boolean' }
    }
};
var validate = validator(todoSchema);
var filter = validator.filter(todoSchema);

exports.createTodo = function(req, res, next) {
    if (!req.body) { return next(new errors.BadRequestError()); }

    // Validate JSON with schema
    var newTodo = filter(req.body);
    if (!validate(newTodo)) {
        req.log.error('Invalid todo body'); // Bunyan logger available on req
        return next(new errors.UnprocessableEntityError('Invalid todo resource body', {errors: validate.errors}));
    }

    // ...Save in backend...
    newTodo.id = '3';

    res.status(201); // Created
    res.location(getFullBaseUrl(req) + '/todos/' + newTodo.id);
    res.json(newTodo);
};

exports.fetchTodoParam = function(req, res, next, id) {
    // Retrieve resource from backend, attach to request...
    req.todo = {
        id: id,
        title: 'Do something',
        isComplete: false
    };
    next();
};

exports.retrieveTodo = function(req, res, next) {
    res.json(req.todo); // Already retrieved by param function
};

exports.updateTodo = function(req, res, next) {
    var todo = req.todo;
    // Example: Resource is forbidden to this user
    return next(new errors.ForbiddenError());
};

exports.deleteTodo = function(req, res, next) {
    var todo = req.todo;
    // Example: Method is not allowed for this user
    return next(new errors.MethodNotAllowedError());
};
