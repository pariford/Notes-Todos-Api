var express = require('express');
var bodyParser = require('body-parser');
var {
    ObjectID
} = require('mongodb');

var port = process.env.PORT || 3000;
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

app.get('/todos', (req, res) => {
    TodoModel.find().then((todos) => {
        res.send({
            todos
        });
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
            res.status(404).send();
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