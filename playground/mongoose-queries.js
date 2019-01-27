const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');



// var id = '5c4de6690d04fc63dcb3b0c7kjm';

// if (!ObjectID.isValid(id)) {
//     console.log('Invalid Id');
// }

// Todo.find({
//     _id: id // With mongoose don't need to convert string ID to objectID w/ string
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }). then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo By Id', todo);
// }).catch((err) => console.log('Error:', err));

var id = '5c4c905b75b12e059839d96d';

if (!ObjectID.isValid(id)) {
    return console.log('Invalid Id');
}

User.findById(id).then((user) => {
    if (!user) {
        return console.log('Id not found');
    }

    console.log('User:', user);
}).catch((err) => console.log('Error:', err));