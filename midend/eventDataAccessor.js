const baseUrl = require("./baseUrl.js");
const XMLHttpRequest = require('../example/node_modules/xmlhttprequest').XMLHttpRequest;

const events_url = baseUrl + '/events';
const event_url = baseUrl + '/event/';

const NAME = 'name';
const DESCRIPTION = 'description';
const CATEGORY = 'category';
const START_TIME = 'startTime';
const END_TIME = 'endTime';
const LOCATION = 'location';

const POST = 'POST';
const PATCH = 'PATCH';
const GET = 'GET';
const DELETE = 'DELETE';
const NOT_FOUND = 404;
const ID_SIZE = 10;

class EventDataAccessor {
    #generateID() {
        var newID;
        try {
            newID = Math.floor(Math.random() * (9999999999)).toString();
            while (newID.length < ID_SIZE) newID = "0" + newID;
            this.getEvent(newID);
            return this.#generateID();
        } catch {
            return newID;
        }
    }

    #patchEvent(event_id, attr_name, new_value) {
        const url = event_url + event_id;
        const eventObj = {};

        eventObj[attr_name] = new_value;

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(PATCH, url, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(eventObj));

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // Event not found
        }

        return xmlhttp.responseText;
    }

    sortByStartTime(events, descending = true) {
        var direction = descending ? -1 : 1;
        var sortedEvents = events;
        if (sortedEvents.length > 1) {
            sortedEvents.sort((a, b) => (new Date(a.startTime).getTime() > new Date(b.startTime).getTime()) ? direction : -direction)
        }
        return sortedEvents;
    }

    createEvent(event_name, description, category, start_time, end_time, location) {
        const url = events_url;
        const eventObj = {
            "id": this.#generateID(),
            "name": event_name,
            "description": description,
            "category": category,
            "startTime": start_time,
            "endTime": end_time,
            "location": location
        };

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(POST, url, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(eventObj));

        if (xmlhttp.status != 201) {
            throw new Error('Event creation failed!');
        }

        return xmlhttp.responseText;
    }

    getEvent(event_id) {
        const url = event_url + event_id;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(GET, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // Event not found
        }

        return xmlhttp.responseText;
    }

    getAllEvents() {
        const url = events_url;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(GET, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 200) {
            throw NOT_FOUND;
        }

        return xmlhttp.responseText;
    }

    updateEventName(event_id, new_event_name) {
        return this.#patchEvent(event_id, NAME, new_event_name);
    }

    updateDescription(event_id, new_description) {
        return this.#patchEvent(event_id, DESCRIPTION, new_description);
    }

    updateCategory(event_id, new_event_name) {
        return this.#patchEvent(event_id, CATEGORY, new_event_name);
    }

    updateStartTime(event_id, new_event_name) {
        return this.#patchEvent(event_id, START_TIME, new_event_name);
    }

    updateEndTime(event_id, new_event_name) {
        return this.#patchEvent(event_id, END_TIME, new_event_name);
    }

    updateLocation(event_id, new_event_name) {
        return this.#patchEvent(event_id, LOCATION, new_event_name);
    }

    deleteEvent(event_id) {
        const url = event_url + event_id;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(DELETE, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 204) {
            throw NOT_FOUND; // Event not found
        }
    }
}

module.exports = EventDataAccessor;
