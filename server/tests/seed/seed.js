const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const usersSeedData = [{
    _id: userOneId,
    email: 'kevin@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'test@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const todosSeedData = [{
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

const populateTodos = (done) => {
    Todo.deleteMany().then(() => {
        return Todo.insertMany(todosSeedData);
    }).then(() => {
        done()
    }).catch((err) => {
        console.log('Before Each populateTodos Error: ', err)
    });
};

const populateUsers = (done) => {
    User.deleteMany().then(() => {
        var userOne = new User(usersSeedData[0]).save();
        var userTwo = new User(usersSeedData[1]).save();

        // Promise utility function that takes array of 
        // promises.  Will process as a response but will
        // only call then when all promises passed are completed
        // successfully.
        return Promise.all([userOne, userTwo])
    }).then(() => {
        done();
    }).catch((err) => {
        console.log('Before Each populateUsers error:', err);
    });
}

module.exports = {
    todosSeedData,
    populateTodos,
    usersSeedData,
    populateUsers
}