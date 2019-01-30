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

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
    
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({message: 'Invalid todo id'});
    } 

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({message: 'No todo with that id'});
        } 
        res.send(todo);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({message: 'Invalid todo id'});
    } 

    Todo.findByIdAndDelete(id).then((doc) => {
        if(!doc) {
            return res.status(404).send({message: 'No todo with that id'});
        }
        res.send(doc);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send({message: 'No todo with that id'});
        }
        res.send(todo);
    }).catch((err) => {
        res.status(500).send(err);
    });

});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
})

module.exports = {
    app
}