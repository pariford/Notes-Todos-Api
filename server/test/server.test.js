const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('mongodb');

const {
    app
} = require('./../server');
const {
    TodoModel
} = require('./../models/todo');

var todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    TodoModel.remove({}).then(() => {
        return TodoModel.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                TodoModel.find({
                    text
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                TodoModel.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                TodoModel.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos:id', () => {
    it('should verify the given todo', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('should verify 404 if todo not found', (done) => {
        var id = new ObjectID();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('should verify 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/123abc`)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe('DELETE /todos:id', () => {
    it('should delete the given todo', (done) => {
        var id = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id.toString());
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                TodoModel.findById(id).then((todo) => {
                    expect(todo).toBe(null);
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return a 404 if the todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 if the todo is a non-object id', (done) => {
        var id = 'abc123';
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This should be the new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(text);
                expect(res.body.todos.completed).toBe(true);
                expect(res.body.todos.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'This should be the new text!!';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(text);
                expect(res.body.todos.completed).toBe(false);
                expect(res.body.todos.completedAt).toNotExist();
            })
            .end(done);
    });
});