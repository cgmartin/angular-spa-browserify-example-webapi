'use strict';
var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var jwtVerify = require('./lib/jwt-verify');
var logsController = require('./controllers/logs-controller');
var authController = require('./controllers/auth-controller');
var todosController = require('./controllers/todos-controller');

var router = module.exports = express.Router();

// Create parsers for application/x-www-form-urlencoded and JSON content types
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json({limit: '200kb'});

// Verify JSON Web Tokens
var verifyJwt = jwtVerify({secret: config.jwt.secret});

// Main router endpoints
router.use('/logs', createLogsRouter());
router.use('/auth', createAuthRouter());
router.use('/todos', createTodoRouter());

/**
 * Logs Routes
 */
function createLogsRouter() {
    var logsRouter = express.Router();
    logsRouter.post('/', jsonParser, logsController.createLog);
    return logsRouter;
}

/**
 * Auth Routes
 */
function createAuthRouter() {
    var authRouter = express.Router();
    authRouter.post('/access-tokens', jsonParser, authController.createToken);
    authRouter.post('/refresh-tokens',
        jsonParser,
        jwtVerify({secret: config.jwt.secret, ignoreExpiration: true}),
        authController.refreshToken
    );
    return authRouter;
}

/**
 * Todos Routes
 */
function createTodoRouter() {
    var todosRouter = express.Router();
    todosRouter.all('*', verifyJwt);
    todosRouter.param('todo_id', todosController.fetchTodoParam);
    todosRouter.get('/', todosController.retrieveTodoList);
    todosRouter.post('/', jsonParser, todosController.createTodo);
    todosRouter.get('/:todo_id', todosController.retrieveTodo);
    todosRouter.put('/:todo_id', todosController.updateTodo);
    todosRouter.delete('/:todo_id', todosController.deleteTodo);
    return todosRouter;
}
