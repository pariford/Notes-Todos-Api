const {
    ObjectID
} = require('mongodb');
const mongoose = require('../server/db/mongoose');
const {
    UserModel
} = require('../server/models/user');

const {
    TodoModel
} = require('../server/models/todo');

var todoID = "5a68983771dd7c4d07f8189e";
var userID = "5b66f8112b8225ce9d387b34";

TodoModel.find({
    _id: todoID
}).then((todos) => {
    console.log(`Todos: ${todos}`);
});

TodoModel.findOne({
    _id: todoID
}).then((todo) => {
    console.log(`Todo: ${todo}`);
});

TodoModel.findById(todoID).then((todo) => {
    console.log(`Todo by ID: ${todo}`);
});

// A way to check if ObjectID is valid or not

/* if (!ObjectID.isValid(userID)) {
    console.log("Error Occured",err);
} */
UserModel.findById(userID).then((user) => {
    if (user) {
        console.log(JSON.stringify(user, undefined, 2));
    } else {
        console.log("User not found");
    }
}).catch((err) => {
    if (err) {
        console.log(err);
    }
});