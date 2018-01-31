const expect = require('expect');
const request = require('supertest');
const {
    UserModel
} = require('../models/user');

const {
    todos,
    populateTestData,
    populateUserData,
    users
} = require('./seed/seed');

const {
    ObjectID
} = require('mongodb');

const {
    app
} = require('./../server');
const {
    TodoModel
} = require('./../models/todo');


beforeEach(populateTestData);
beforeEach(populateUserData);

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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a new user if authenticated', (done) => {
        var userName = "Paritosh Bapat";
        var email = "paritoshvit@gmail.com";
        var password = "123abc!";
        request(app)
            .post('/users')
            .send({
                userName,
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                UserModel.findOne({
                    email
                }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                });
            });
    });

    it('should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                userName: "gdgd",
                email: "gddg",
                password: "gdfgd"
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.errors).toExist();
            })
            .end(done);
    });

    it('should errors if email/userName already exist', (done) => {
        request(app)
            .post('/users')
            .send({
                userName: "ABCD",
                email: "abc@gmail.com"
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.errmsg).toExist();
            })
            .end(done);
    });
});