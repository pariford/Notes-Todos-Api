/* const mongodb = require('mongodb').MongoClient; */

const {
    MongoClient,
    ObjectID
} = require('mongodb'); /* ECMA6 style to write the above line using object destructuring*/

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        throw new Error('Unable to connect to the database');
    }
    var db = client.db('TodoApp');
    console.log("Connected to the MongoDB Server");

    //deleteMany
    db.collection("Todos").deleteMany({
        age: 25
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        if (err) {
            throw new Error("Unable to delete the data", err);
        }
    });

    //deleteOne
    db.collection("Todos").deleteOne({
        name: 'Abhishek'
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        if (err) {
            throw new Error("Unable to delete the data", err);
        }
    });

    //findOneAndDelete
    db.collection("Todos").findOneAndDelete({
        _id: new ObjectID('5a66198fa35a3829b42d0b13')
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        if (err) {
            console.log("Unable to delete the data")
        }
    });
    client.close();
});