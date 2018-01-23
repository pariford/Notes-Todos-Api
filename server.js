const express = require('express');

const {
    TodoModel
} = require('./model/todo');
const {
    UserModel
} = require('./model/user');
const {
    mongoose
} = require('./db/mongoose');

var TodoApp = new TodoModel({
    text: "Paritosh"
});

TodoApp.save().then((result) => {
    console.log("Todos Properties:", result)
}, (err) => {
    console.log("Error occured", err);
});
mongoose.disconnect();