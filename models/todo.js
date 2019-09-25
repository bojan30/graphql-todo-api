const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({

    task: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    }

}, {versionKey: false})

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;