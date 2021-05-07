var userDataAccessor = require('../userDataAccessor.js');
const { hashPassword } = require('../passwordGeneration.js');
const NOT_FOUND = 404;
const USER_NAME = 'johnsMiTh';
const FIRST_NAME = 'john';
const LAST_NAME = 'smith';
const PERMISSIONS = "child";
const BIRTHDAY = "01/01/1900";
const GENDER = "m";
const TAGS = ["testTag1", "testTag2"];

const saltHash = hashPassword('password');
const SALT = saltHash.salt;
const HASH = saltHash.hash;

// Initialize uda class
var u = new userDataAccessor();

// Create user example
try {
    console.log('Create user test:');
    var obj = (JSON.parse(u.createUser(USER_NAME, FIRST_NAME, LAST_NAME, PERMISSIONS, GENDER, BIRTHDAY, TAGS, SALT, HASH))); // Data returned from the POST request
    var data = obj.data; // Relevant info from the API response

    console.log('Created user:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    console.log('Error creating user!');
}

// Create user example
try {
    console.log('\nCreate user test:');
    var obj = (JSON.parse(u.createUser("testUser2", FIRST_NAME, LAST_NAME, PERMISSIONS, GENDER, BIRTHDAY, TAGS, SALT, HASH))); // Data returned from the POST request
    var data = obj.data; // Relevant info from the API response

    console.log('Created user:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    console.log('Error creating user!');
}

// User search example
try {
    console.log('\nUser search test:');
    var obj = (JSON.parse(u.getUser(USER_NAME))); // The full API response to the GET request
    var data = obj.data; // Just the relevant info from the API response

    console.log('Found user:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}

// Get all users example
try {
    console.log('\nGet all users search test:');
    var obj = (JSON.parse(u.getAllUsers())); // The full API response to the GET request
    var data = obj.data; // Just the relevant info from the API response

    console.log('Found users:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('Error!');
    }
}

// Get all children example
try {
    console.log('\nGet all children search test:');
    var children = u.getAllChildren(); // Array containing the corresponding users

    console.log('Found children:\n' + JSON.stringify(children)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('Error!');
    }
}

// Get all staff example
try {
    console.log('\nGet all staff search test:');
    var staff = u.getAllStaff(); // Array containing the corresponding users

    console.log('Found users:\n' + JSON.stringify(staff)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('Error!');
    }
}

// Get all children and staff example (more efficient because it only calls the API once)
try {
    console.log('\nGet all children and staff search test:');
    const getcs = u.getAllChildrenAndStaff(); // Arrays containing the corresponding users
    var staff = getcs.staff;
    var children = getcs.children;

    console.log('Found children:\n' + JSON.stringify(children)); // JSON.stringify(data) turns the data into a string to be printed.
    console.log('Found staff:\n' + JSON.stringify(staff));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('Error!');
    }
}

// Add tag example
try {
    console.log('\nAdd tag test:');
    var obj = (JSON.parse(u.addTag(USER_NAME, "ADDED_TAG")));
    var data = obj.data;

    console.log('Added tag:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}

// Remove tag example
try {
    console.log('\nRemove tag test:');
    var obj = (JSON.parse(u.removeTag(USER_NAME, "ADDED_TAG")));
    var data = obj.data;

    console.log('Removed tag:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}

// Update fName (first name) example
try {
    console.log('\nUpdate fName test:');
    var obj = (JSON.parse(u.updateFirstName(USER_NAME, 'jerry')));
    var data = obj.data;

    console.log('Updated fName:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}

// Update lName (last name) example
try {
    console.log('\nUpdate lName test:');
    var obj = (JSON.parse(u.updateLastName(USER_NAME, 'garcia')));
    var data = obj.data;

    console.log('Updated lName:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}

// Update permission example
try {
    console.log('\nUpdate permission test:');
    var obj = (JSON.parse(u.updatePermission(USER_NAME, "staff")));
    var data = obj.data;

    console.log('Updated permissions:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}

// Update gender example
try {
    console.log('\nUpdate gender test:');
    var obj = (JSON.parse(u.updateGender(USER_NAME, "f")));
    var data = obj.data;

    console.log('Updated gender:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}

// Update birthday example
try {
    console.log('\nUpdate birthday test:');
    var obj = (JSON.parse(u.updateBirthday(USER_NAME, "01/01/2000")));
    var data = obj.data;

    console.log('Updated birthday:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}

// Update salt example
try {
    console.log('\nUpdate salt test:');
    var obj = (JSON.parse(u.updateSalt(USER_NAME, 'newSalt')));
    var data = obj.data;

    console.log('Updated salt:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}

// Update hash example
try {
    console.log('\nUpdate hash test:');
    var obj = (JSON.parse(u.updateHash(USER_NAME, 'newHash')));
    var data = obj.data;

    console.log('Updated hash:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}

// Delete user example
try {
    console.log('\nDelete user test:');
    u.deleteUser(USER_NAME);
    u.deleteUser("testUser2");
    console.log('Deleted username: ' + USER_NAME);
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided username was not found!');
    }
}
