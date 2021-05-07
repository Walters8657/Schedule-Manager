var EventDataAccessor = require('../eventDataAccessor.js');
const NOT_FOUND = 404;
const EVENT_NAME = 'test event';
const DESCRIPTION = 'test description';
const CATEGORY = 'test category';
const START_TIME = Date.now().toString();
const END_TIME = Date.now().toString();
const LOCATION = 'test location';

// Initialize Event object
var e = new EventDataAccessor();

// Create event example
var eID; // event id - needs to be stored so we can modify the event

try {
    var obj = (JSON.parse(e.createEvent(EVENT_NAME, CATEGORY, DESCRIPTION, START_TIME, END_TIME, LOCATION))); // POST
    var data = obj.data; // Relevant info from the API response

    eID = data.id; // The event ID that needs to be stored in order to clock out.
    console.log('Created event:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    console.log('Error creating event!');
}

// Event search example
try {
    var obj = (JSON.parse(e.getEvent(eID))); // The full API response to the GET request
    var data = obj.data; // Just the relevant info from the API response

    console.log('Found event:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided event ID was not found!');
    } else {
        throw e;
    }
}

// Get all events example
try {
    var obj = (JSON.parse(e.getAllEvents())); // The full API response to the GET request
    var data = obj.data; // Just the relevant info from the API response

    console.log('Found event:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided event ID was not found!');
    } else {
        throw e;
    }
}

// Change event name example
try {
    var obj = (JSON.parse(e.updateEventName(eID, 'new event name'))); // same as above but for a PATCH request this time
    var data = obj.data; // Relevant info from the API response

    console.log('Updated event name:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided event ID was not found!');
    }
}

// Change description example
try {
    var obj = (JSON.parse(e.updateDescription(eID, 'new event desc')));
    var data = obj.data; // Relevant info from the API response

    console.log('Updated event description:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided event ID was not found!');
    }
}

// Change category example
try {
    var obj = (JSON.parse(e.updateCategory(eID, 'new category'))); // same as above but for a PATCH request this time
    var data = obj.data; // Relevant info from the API response

    console.log('Updated category:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided event ID was not found!');
    }
}

// Change start time example
try {
    var obj = (JSON.parse(e.updateStartTime(eID, 'new start time'))); // same as above but for a PATCH request this time
    var data = obj.data; // Relevant info from the API response

    console.log('Updated start time:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided event ID was not found!');
    }
}

// Change end time example
try {
    var obj = (JSON.parse(e.updateEndTime(eID, 'new end time'))); // same as above but for a PATCH request this time
    var data = obj.data; // Relevant info from the API response

    console.log('Updated end time:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided event ID was not found!');
    }
}

// Change locations example
try {
    var obj = (JSON.parse(e.updateLocation(eID, 'new location'))); // same as above but for a PATCH request this time
    var data = obj.data; // Relevant info from the API response

    console.log('Updated location:\n' + JSON.stringify(data)); // JSON.stringify(data) turns the data into a string to be printed.
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided event ID was not found!');
    }
}

// Delete event example
try {
    e.deleteEvent(eID);
    console.log('Deleted event id: ' + eID);
} catch(e) {
    if (e == NOT_FOUND) {
        console.log('The provided event ID was not found!');
    } else {
        throw e;
    }
}
