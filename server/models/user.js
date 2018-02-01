const jsonwebtoken = require('jsonwebtoken');
const _ = require('lodash');
const bcryptjs = require('bcryptjs');

const {
    isEmail
} = require('validator');
const mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
    userName: {
        type: "String",
        trim: true,
        required: true,
        minlength: 1,
        unique: true
    },
    email: {
        type: "String",
        trim: true,
        required: true,
        minlength: 1,
        //validate: [isEmail, 'invalid email']    One way of validating
        //another way of validating using mongoose inbuilt validators
        validate: {
            validator: isEmail,
            message: '{VALUE} is not a valid email'
        },
        unique: true
    },
    password: {
        type: "String",
        minlength: 6,
        require: true
    },
    tokens: [{
        access: {
            type: "String",
            require: true
        },
        token: {
            type: "String",
            require: true
        }
    }]
});
//to return only relevant data from the server
UserSchema.methods.toJSON = function () {
    var user = this;
    //Converting mongoose object into an object,and using the properties which only user mongoose object possess
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}

//whatever you add to methods method turns into an instance method
UserSchema.methods.generateAuthToken = function () {
    //creating a instance
    var user = this;
    var access = 'auth';
    var token = jsonwebtoken.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();
    user.tokens.push({
        access,
        token
    });
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
};

//whatever you add to statics method turns into an model method as 
//opposed to an instance method.
UserSchema.statics.findByToken = function (token) {
    //creating a model
    var UserModel = this;
    var decoded;
    try {
        decoded = jsonwebtoken.verify(token, 'abc123')
    } catch (error) {
        /* return new Promise((resolve, reject) => {
            reject();
        }); */
        //another way to send Promise
        return Promise.reject();
    }
    return UserModel.findOne({
        //for normal keys its not mandatory
        '_id': decoded._id,
        //whenever you are using dot notation,we need to give the same in quotes
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (userName, email, password) {
    var UserModel = this;
    return UserModel.findOne({
        email,
        userName
    }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcryptjs.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
}

UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});
var UserModel = mongoose.model('UserModel', UserSchema);

module.exports = {
    UserModel
}