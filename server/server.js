// Config
require('./config/config.js');

// Library Impors
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Local Imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

// TODOS
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send({message: err});
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }).catch((err) => {
        res.status(400).send({message: err});
    });
    
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({message: 'Invalid todo id'});
    } 

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send({message: 'No todo with that id'});
        } 
        res.send(todo);
    }).catch((err) => {
        res.status(500).send({message: err});
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({message: 'Invalid todo id'});
    } 

    Todo.findOneAndDelete({
        _id: id,
        _creator: req.user._id
    }).then((doc) => {
        if(!doc) {
            return res.status(404).send({message: 'No todo with that id'});
        }
        res.send(doc);
    }).catch((err) => {
        res.status(500).send({message: err});
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({message: 'Invalid todo id'});
    } 

    var body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null; //Removes value from DB
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send({message: 'No todo with that id'});
        }
        res.send(todo);
    }).catch((err) => {
        res.status(500).send({message: err});
    });

});

// USERS

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(500).send({message: err});
    });
});

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        // Not used like POST /users above, with chaining, because
        // want to leverage user variable.  Return would catch
        // errors.  Success procees into then here.
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((error) => {
        res.status(400).send();
    });
});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
})

module.exports = {
    app
}