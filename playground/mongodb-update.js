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

    //findOneAndDelete
    /*     db.collection("Todos").findOneAndUpdate({
            _id: new ObjectID('5a662f0ea35a3829b42d0b16')
        }, {
            $set: {
                text: "Hello World"
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(JSON.stringify(result, undefined, 2));
        }, (err) => {
            if (err) {
                console.log("Unable to update the data",err)
            }
        }); */

    db.collection("Todos").findOneAndUpdate({
        _id: new ObjectID('5a662f0ea35a3829b42d0b16')
    }, {
        $set: {
            text: "Paritosh Bapat"
        },
        $inc: {
            count: 1
        },
        $unset: {
            age:''
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        if (err) {
            console.log("Unable to update the data",err)
        }
    });

    client.close();
});