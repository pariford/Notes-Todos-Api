const {
    MongoClient,
    ObjectID
} = require('mongodb');
MongoClient.connect("mongodb://localhost:27017", (err, client) => {
    if (err) {
        throw new Error("Unable to Connect to MongoDB Server")
    }
    console.log("Connected to the MongoDB Server")
    var db = client.db("TodoApp");
    db.collection("Todos").find({
        _id: new ObjectID('5a65e6aea35a3829b42d0b0c')
    }).toArray().then(docs => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        if (err) {
            console.log("Unable to find any data");
        }
    });

    db.collection("Todos").find().count().then(count => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        if (err) {
            console.log("Unable to find any data");
        }
    });

    db.collection("Todos").find({age:25}).toArray().then(docs => {
        console.log(JSON.stringify(docs,undefined,2));
    }, (err) => {
        if (err) {
            console.log("Unable to find any data");
        }
    });
    client.close();
});