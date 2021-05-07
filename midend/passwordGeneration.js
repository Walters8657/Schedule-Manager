var crypto = require('crypto');

function hashPassword(password) {
    var salt = crypto.randomBytes(128).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');

    return {
        salt:salt,
        hash:value
    };
}
//Generate a new random password of length 10
function generatePassword(length=10) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

module.exports = { hashPassword, generatePassword };
