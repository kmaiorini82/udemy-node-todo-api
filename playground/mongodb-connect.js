// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if (err) {
        // Return prevents everything from proceeding if an error
         return console.log(err);
    }
    
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, results) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', error);
    //     }

    //     console.log(JSON.stringify(results.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Kaylee Maiorini',
    //     age: '5 months',
    //     location: 'North Massapequa, NY'
    // }, (err, results) => {
    //     if (err) {
    //         return console.log('Unable to insert user', error);
    //     }

    //     console.log(JSON.stringify(results.ops, undefined, 2));

    //     console.log('Timestamp:', results.ops[0]._id.getTimestamp());
    // });

    client.close();
});