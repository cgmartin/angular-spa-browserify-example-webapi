// https://github.com/mafintosh/is-my-json-valid
// http://json-schema.org/documentation.html
exports.todoSchema = {
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
