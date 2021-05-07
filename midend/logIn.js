var crypto = require('crypto');
var userDataAccessor = require('./userDataAccessor.js');

function isPasswordCorrect(userName, passwordAttempt) {
    var u = new userDataAccessor();
    try {
        userObj = JSON.parse(u.getUser(userName));
    } catch (e) {
        return false;
    }

    savedSalt = userObj.data.salt;
    savedHash = userObj.data.hash;

    var hash = crypto.createHmac('sha512', savedSalt);
    hash.update(passwordAttempt);
    var value = hash.digest('hex');

    return savedHash == value;
}

module.exports = {isPasswordCorrect};