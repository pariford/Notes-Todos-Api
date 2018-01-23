const mongoose = require('mongoose')

var TodoSchema = mongoose.Schema({
    text: {
        type: "String",
        trim: true,
        required: true,
        minlength: 1
    },
    completed: {
        type: "Boolean",
        default: "true"
    },
    completedAt: {
        type: "Number",
        default: null
    }
});

var TodoModel = mongoose.model('TodoModel', TodoSchema);

module.exports={TodoModel}