const {
    isEmail
} = require('validator');
const mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
    user: {
        type: "String",
        trim: true,
        required: true,
        minlength: 1
    },
    email: {
        type: "String",
        trim: true,
        required: true,
        minlength: 1,
        validate: [isEmail, 'invalid email']
    }
});
var UserModel = mongoose.model('UserModel', UserSchema);

module.exports = {
    UserModel
}