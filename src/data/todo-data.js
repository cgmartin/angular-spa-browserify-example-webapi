'use strict';

var r = require('../lib/rdb');

exports.getTodosByUserId = function(userId) {
    return r.table('todos')
        .getAll(userId, {index: 'userId'})
        .run()
        .then(function(result) {
            return (result && result.length > 0) ? result[0] : null;
        });
};

exports.getTodo = function(todoId) {
    return r.table('todos')
        .get(todoId)
        .delete()
        .run();
};

exports.removeTodo = function(todoId) {
    return r.table('todos')
        .get(todoId)
        .delete()
        .run();
};

exports.createTodo = function(todo, userId) {
    todo.userId = userId;
    return r.table('todos')
        .insert(todo)
        .run();
};
