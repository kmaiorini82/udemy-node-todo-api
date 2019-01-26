const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if (err) {
        // Return prevents everything from proceeding if an error
         return console.log(err);
    }
    
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos')
    //     // .find()
    //     // .find({completed: false})
    //     .find({_id: new ObjectID('5c4b8c70be042a4b28a31332')})
    //     .toArray()
    //     .then((docs) => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log('Unable to fetch todos', err);
    //     });

    // db.collection('Todos')
    //     .find()
    //     .count()
    //     .then((count) => {
    //         console.log(`There are ${count} todos`);
    //     }, (err) => {
    //         console.log('Unable to fecth todos count', err);
    //     });

    db.collection('Users')
        .find({name: 'Kaylee Maiorini'})
        .toArray()
        .then((docs) => {
            console.log('Users');
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log('Unable to fetch users', err);
        });

    // client.close();
});