const MAX_ID = 999;

// First 3 letters of the first name, first 5 letters of the last name, up to 3 random numbers.
// ex: jactanda325

function generateUsername(first_name, last_name) {
    const updatedFirstName = first_name.replace(/[^0-9a-z]/gi, '');
    const updatedLastName = last_name.replace(/[^0-9a-z]/gi, '');

    var username = updatedLastName.toLowerCase() + updatedFirstName.toLowerCase().substring(0, 1);
    username += Math.floor(Math.random() * Math.floor(MAX_ID));

    return username;
}

module.exports = { generateUsername };