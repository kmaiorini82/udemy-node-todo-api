// Library imports
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// Local imports
const {app} = require('./../server');
const {Todo} = require('./../models/todo')

const todosSeedData = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todosSeedData);
    }).then(() => done());
});

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