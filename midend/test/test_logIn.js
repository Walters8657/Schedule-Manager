const { isPasswordCorrect } = require('../logIn.js');
const { hashPassword } = require('../passwordGeneration.js');
const userDataAccessor = require('../userDataAccessor.js');
const { generateUsername } = require('../usernameGenerator.js');

const FIRST_NAME = 'joe';
const LAST_NAME = 'brady';
const USER_NAME = generateUsername(FIRST_NAME, LAST_NAME);
const PASSWORD = 'password';

var u = new userDataAccessor();

salthash = hashPassword(PASSWORD);

console.log("Creating user " + USER_NAME + "...");
u.createUser(USER_NAME, FIRST_NAME, LAST_NAME, 'child', 'm', '01/01/2000', [], salthash.salt, salthash.hash);
console.log('Created user.');

// True
console.log("Checking for password " + PASSWORD + ". Should print true");
console.log(isPasswordCorrect(USER_NAME, PASSWORD));

// False
console.log("Checking for password password2. Should print false");
console.log(isPasswordCorrect(USER_NAME, 'password2'));

// Error: no user found
console.log("Checking for password on invalid user. Should print false.");
try {
    console.log(isPasswordCorrect('testboy2', PASSWORD));
} catch(e) {
    console.log('User not found');
}

// Clean up
u.deleteUser(USER_NAME);