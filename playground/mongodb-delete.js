const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if (err) {
        // Return prevents everything from proceeding if an error
         return console.log(err);
    }
    
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // deleteMany
    // db.collection('Todos')
    //     .deleteMany({text: 'Eat lunch'})
    //     .then((res) => {
    //         console.log('Result:', res);
    //     }, (err) => {
    //         console.log('Error:', err);
    //     });

    // deleteOne - deletes first instance it finds
    // db.collection('Todos')
    //     .deleteOne({text: 'Eat lunch'})
    //     .then((res) => {
    //         console.log('Result:', res);
    //     }, (err) => {
    //         console.log('Error:', err);
    //     })

    // findOneAndDelete
    // db.collection('Todos')
    //     .findOneAndDelete({completed: false})
    //     .then((res) => {
    //         console.log('Result:', res);
    //     }, (err) => {
    //         console.log('Error:', err);
    //     });
    
    // db.collection('Users')
    //     .deleteMany({name: 'Kevin Maiorini'})
    //     .then((res) => {
    //         console.log('Result: ', res);
    //     }, (err) => {
    //         console.log('Error:', err);
    //     });

    db.collection('Users')
        .findOneAndDelete({_id: new ObjectID('5c4b96ccbe1bbb39543150fa')})
        .then((res) => {
            console.log('Result: ', res);
        }, (err) => {
            console.log('Error:', err);
        });


    // client.close();
});