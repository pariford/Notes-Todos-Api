const jsonwebtoken = require('jsonwebtoken');

const {
    SHA256
} = require('crypto-js');

var data = {
    id: 10
}
var token = jsonwebtoken.sign(data, '123abc');
console.log(token);
var decoded = jsonwebtoken.verify(token, '123abc');
console.log('decoded', decoded);
//jsonwebtoken.sign             //takes the object with the user id,add a secret, makes the hash and return a token
//jsonwebtoken.verify           // takes the token and verify it

var message = "This is my name";
var hash = SHA256(message).toString();
console.log(message);
console.log(hash);

var data = {
    id: 4
};
var token = {
    data,
    hash: SHA256(JSON.stringify(data) + "somesecret").toString()
}

/* token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString();
 */
var resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();

if (resultHash === token.hash) {
    console.log("Data is safe")
} else {
    console.log("Data is not safe");
}