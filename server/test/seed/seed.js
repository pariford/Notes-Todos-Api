const jwt = require('jsonwebtoken');
require('../../db/config');

const {
    UserModel
} = require('./../../models/user');

const {
    ObjectID
} = require('mongodb');
const {
    TodoModel
} = require('./../../models/todo');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
console.log(process.env.JWT_SECRET);
const users = [{
    _id: userOneId,
    userName: "Shivani Dole",
    email: "shivanics.vit@gmail.com",
    password: "abc123!",
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userOneId,
            access: 'auth'
        }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    userName: "ABC2",
    email: "abc2@gmail.com",
    password: "abc2123!",
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userTwoId,
            access: 'auth'
        }, process.env.JWT_SECRET).toString()
    }]
}]

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateTestData = (done) => {
    TodoModel.remove({}).then(() => {
        return TodoModel.insertMany(todos);
    }).then(() => done());
};

const populateUserData = (done) => {
    UserModel.remove({}).then(() => {
        var userOne = new UserModel(users[0]).save();
        var userTwo = new UserModel(users[1]).save();
        return Promise.all([userOne, userTwo])
    }).then(() => {
        done();
    })
};

module.exports = {
    todos,
    populateTestData,
    populateUserData,
    users
}