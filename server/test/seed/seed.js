const jwt = require('jsonwebtoken');

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

const users = [{
    _id: userOneId,
    userName: "ABC",
    email: "abc@gmail.com",
    password: "abc123!",
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userOneId,
            access: 'auth'
        }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    userName: "ABC2",
    email: "abc2@gmail.com",
    password: "abc2123!"
}]

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
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