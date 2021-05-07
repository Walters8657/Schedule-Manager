var scheduleDataAccessor = require('../scheduleDataAccessor.js');
const NOT_FOUND = 404;
const USER_NAME = 'johnsmith';
const EVENTS = ["1455665588","1234567890"];
const TEST_EVENT = "1";

// Initialize uda class
var s = new scheduleDataAccessor();

// Create schedule example
try {
    console.log('Create schedule test:');
    var obj = (JSON.parse(s.createSchedule(USER_NAME, EVENTS))); // Data returned from the POST request
    var data = obj.data; // Relevant info from the API response

    console.log('Created schedule:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    console.log('Error creating schedule!');
}

// Schedule search example
try {
    console.log('\nSchedule search test:');
    var obj = (JSON.parse(s.getSchedule(USER_NAME))); // The full API response to the GET request
    var data = obj.data; // Just the relevant info from the API response

    console.log('Found schedule:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided user name was not found!');
    }
}

// Get all schedules example
try {
    console.log('\nGet all schedules search test:');
    var obj = (JSON.parse(s.getAllSchedules())); // The full API response to the GET request
    var data = obj.data; // Just the relevant info from the API response

    console.log('Found schedules:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('Error!');
    }
}

// Add event example
try {
    console.log('\nAdd event test:');
    var obj = (JSON.parse(s.addEvent(USER_NAME, TEST_EVENT)));
    var data = obj.data;

    console.log('Added event:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided user name was not found!');
    }
}

// Remove event example
try {
    console.log('\nRemove event test:');
    var obj = (JSON.parse(s.removeEvent(USER_NAME, TEST_EVENT)));
    var data = obj.data;

    console.log('Removed event:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided user name was not found!');
    }
}

// Overwrite events example
try {
    console.log('\nOverwrite events test:');
    var obj = (JSON.parse(s.overwriteEvents(USER_NAME, ['TESTeventID', 'TESTeventID2'])));
    var data = obj.data;

    console.log('Updated events:\n' + JSON.stringify(data));
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided user name was not found!');
    }
}

// Delete schedule example
try {
    console.log('\nDelete schedule test:');
    s.deleteSchedule(USER_NAME);
    console.log('Deleted schedule for user: ' + USER_NAME);
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided user name was not found!');
    }
}
