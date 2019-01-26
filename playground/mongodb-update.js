const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if (err) {
        // Return prevents everything from proceeding if an error
         return console.log(err);
    }
    
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

//    db.collection('Todos')
//     .findOneAndUpdate({
//         _id: new ObjectID('5c4c81b97d50d59433d27d3b')
//     }, {
//         $set: {
//             completed: true
//         }
//     }, {
//         returnOriginal: false
//     }).then((res) => {
//             console.log('Result: ', res);
//         }, (err) => {
//             console.log('Error:', err);
//         });

// db.collection('Users')
//     .findOneAndUpdate({
//         _id: new ObjectID('5c4b9745f444341c2826a8a5')
//     }, {
//         $set: {
//             name: 'Kevin Maiorini',
//             age: 36
//         }
//     }, {
//         returnOriginal: false
//     }).then((res) => {
//             console.log('Result: ', res);
//         }, (err) => {
//             console.log('Error:', err);
//         }
//     );

db.collection('Users')
    .findOneAndUpdate({
        _id: new ObjectID('5c4b9745f444341c2826a8a5')
    }, {
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((res) => {
            console.log('Result: ', res);
        }, (err) => {
            console.log('Error:', err);
        }
    );


    // client.close();
});