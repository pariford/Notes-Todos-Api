const express = require('express');
const bodyParser = require('body-parser');
const {
    TodoModel
} = require('./model/todo');
const {
    UserModel
} = require('./model/user');
const {
    mongoose
} = require('./db/mongoose');
var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
});

app.listen(3000, (err) => {
    throw new Error("Unable to listen to the server");
})


var TodoApp = new TodoModel({
    text: "Paritosh"
});