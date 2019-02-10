// Library imports
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// Local imports
const {app} = require('./../server');
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user');
const {todosSeedData, populateTodos, usersSeedData, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    // return just stops execution
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    // return just stops execution
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            })
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
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get todo by id', (done) => {
        request(app)
            .get(`/todos/${todosSeedData[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todosSeedData[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe('No todo with that id');
            })
            .end(done)
    });

    it('should return a 404 if for non-object ids', (done) => {
        request(app)
            .get(`/todos/kjm`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe('Invalid todo id');
            })
            .end(done)
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        request(app)
            .delete(`/todos/${todosSeedData[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todosSeedData[0].text);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                var todoDeleted = JSON.parse(response.text);

                Todo.findById(todoDeleted._id).then((todo) => {
                    expect((res) => {
                        expect(res).toNotExist()
                    });
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should return a 404 if no document is found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe('No todo with that id');
            })
            .end(done)
    });

    it('should return 404 if invalid object id is sent', (done) => {
        request(app)
            .delete(`/todos/kjm`)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe('Invalid todo id');
            })
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todosSeedData[0]._id;
        var text = 'Test text';

        request(app)
            .patch(`/todos/${id}`)
            .send({text, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
                expect(res.body.completed).toBeTruthy();
                expect(typeof res.body.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todosSeedData[1]._id;
        var text = 'Test text';

        request(app)
            .patch(`/todos/${id}`)
            .send({text, completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
                expect(res.body.completed).toBeFalsy();
                expect(res.body.completedAt).toBeNull();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', usersSeedData[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(usersSeedData[0]._id.toHexString());
                expect(res.body.email).toBe(usersSeedData[0].email);
                expect(res.body.password).toBeUndefined();
            })
            .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            // .set('x-auth', usersSeedData[0].tokens[0].token)
            .expect(401)
            .expect((res) => {
                expect(res.body.message).toBe('User must be authorized');
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'email@example.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeDefined();
                expect(res.body._id).toBeDefined();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) return done(err);

                User.findOne({email}).then((user) => {
                    expect(user).toBeDefined();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = 'adasdgasas';
        var password = '123';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(500)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeUndefined();
                expect(res.body.message).toBeDefined();
            })
            .end(done);
    });

    it('should not create user if email is in use', (done) => {
        request(app)
            .post('/users')
            .send({email: usersSeedData[0].email, password: usersSeedData[0].password})
            .expect(500)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeUndefined();
                expect(res.body.message).toBeDefined();
            })
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: usersSeedData[1].email,
                password: usersSeedData[1].password
            })
            .expect(200)
            .expect((res) => {
                // Using brackets because of '-'
                // will not allow . notation
                expect(res.headers['x-auth']).toBeDefined();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(usersSeedData[1]._id).then((user) => {
                    expect(user.tokens[0]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: usersSeedData[1].email,
                password: 'wrongpassword'
            })
            .expect(400)
            .expect((res) => {
                // Using brackets because of '-'
                // will not allow . notation
                expect(res.headers['x-auth']).not.toBeDefined();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(usersSeedData[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', usersSeedData[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                User.findById(usersSeedData[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
});