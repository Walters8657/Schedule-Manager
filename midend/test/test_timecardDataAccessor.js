var TimecardDataAccessor = require('../timecardDataAccessor.js');
const NOT_FOUND = 404;
const USER_NAME = 'bobsmith';
const EVENT_ID = 'someEventId';

// Initialize Timecard class
var t = new TimecardDataAccessor();

// Clock in example
var tcID; // time card id - needs to be stored so we can clock out

try {
    var obj = (JSON.parse(t.clockIn(USER_NAME, EVENT_ID, Date.now().toString()))); // same as above but for a POST request this time
    var data = obj.data; // Relevant info from the API response

    tcID = data.id; // The timecard ID that needs to be stored in order to clock out.
    console.log('Clocked-in:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    console.log('Error clocking in!');
}

// Timecard search example
try {
    var obj = (JSON.parse(t.getTimecard(tcID))); // The full API response to the GET request
    var data = obj.data; // Just the relevant info from the API response

    console.log('Found timecard:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided timecard ID was not found!');
    }
}

// Timecard search by user name example (returns all of the timecards associated with a user)
try {
    var obj = (JSON.parse(t.getTimecardsForUser(USER_NAME))); // The full API response to the GET request
    var data = obj.data; // Just the relevant info from the API response

    console.log('Found timecard(s) for user:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided user name was not found!');
    }
}

// Timecard search by event id example (returns all of the timecards associated with an event)
try {
    var obj = (JSON.parse(t.getTimecardsForEvent(EVENT_ID))); // The full API response to the GET request
    var data = obj.data; // Just the relevant info from the API response

    console.log('Found timecard(s) for event:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided event id was not found!');
    }
}

// Clock out example
try {
    var obj = (JSON.parse(t.clockOut(Date.now().toString(), tcID))); // same as above but for a PATCH request this time
    var data = obj.data; // Relevant info from the API response
    console.log('Clocked-out:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided timecard ID was not found!');
    }
}

// Delete timecard example
try {
    t.deleteTimecard(tcID);
    console.log('Deleted timecard id: ' + tcID);
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided timecard ID was not found!');
    }
}
