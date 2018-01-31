var express = require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');
require('./db/config');
const {
    authenticate
} = require('./middleware/authenticate');


var {
    ObjectID
} = require('mongodb');


var port = process.env.PORT;
var {
    mongoose
} = require('./db/mongoose');
var {
    TodoModel
} = require('./models/todo');
var {
    UserModel
} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new TodoModel({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(404).send(e);
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['userName', 'email', 'password']);
    var user = new UserModel(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        //when you are creating a header for a specific purpose, prefix it with x
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
    TodoModel.find().then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/users', (req, res) => {
    UserModel.find().then((users) => {
        if (users) {
            res.send(
                users
            );
        } else {
            res.status(404).send();
        }
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send("Invalid ID");
    }
    TodoModel.findById(id).then((todo) => {
        if (todo) {
            res.send({
                todo
            });
        } else {
            res.status(404).send();
        }
    }, (e) => {
        res.status(400).send(e);
    });
});


app.get('/users/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send("Invalid ID");
    }
    UserModel.findById(id).then((user) => {
        if (user) {
            res.send(
                user
            );
        } else {
            res.status(404).send();
        }
    }, (e) => {
        res.status(400).send(e);
    });

});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send("Invalid ID");
    }
    TodoModel.findByIdAndRemove(id).then((todo) => {
        if (todo) {
            res.send({
                todo
            });
            console.log("Record deleted")
        } else {
            res.status(404).send("Record not found");
        }
    }, (e) => {
        res.status(400).send(e);
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send("Invalid ID");
    }
    var body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    TodoModel.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todos) => {
        res.send({
            todos
        });
        console.log(`Record updated with id ${id}`);
    }).catch((err) => {
        res.status(400).send();
    })
});

app.delete('/users/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send("Invalid ID");
    }
    UserModel.findByIdAndRemove(id).then((user) => {
        if (user) {
            res.send({
                user
            });
            console.log("Record deleted")
        } else {
            res.status(404).send("Record not found");
        }
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log(`Started the server on port:${port}`);
});

module.exports = {
    app
};