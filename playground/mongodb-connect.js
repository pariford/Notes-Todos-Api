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
    db.collection("Todos").insertOne({
        text: "Something random"
    }, (err, result) => {
        if (err) {
            throw new Error("Unable to insert  the data", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection("Todos").insertOne({
        name: "Paritosh",
        age: 25,
        location: "Chennai"
    }, (err, result) => {
        if (err) {
            throw new Error("Unable to insert the data", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    client.close();
});