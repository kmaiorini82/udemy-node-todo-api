const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Remove all records -> must pass {} 
// unlike find which allows empty arguments
// Todo.deleteMany({}).then((result) => {
//     console.log(result);
// });

// Deletes document but returns document
// being deleted.
// Todo.findOneAndDelete({_id:'5c51a4c37d50d59433d2a1fe'})

// Deletes document
// Todo.deleteOne()

// Deletes document by ID and returns
// document
Todo.findByIdAndDelete('5c51a4c37d50d59433d2a1fe').then((doc) => {
    console.log('Doc:', doc);
}).catch((err) => {
    console.log('Error:', err);
});