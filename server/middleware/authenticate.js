const {
    UserModel
} = require('./../models/user')


var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    //return the user associated with the particular token
    UserModel.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        res.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
}

module.exports = {
    authenticate
};