const baseUrl = require("./baseUrl.js");
const XMLHttpRequest = require('../example/node_modules/xmlhttprequest').XMLHttpRequest;

const timecards_url = baseUrl + '/timecards';
const timecard_url = baseUrl + '/timecard/';

const POST = 'POST';
const PATCH = 'PATCH';
const GET = 'GET';
const DELETE = 'DELETE';
const TIME_IN = 'timeIn';
const TIME_OUT = 'timeOut';
const NOT_FOUND = 404;
const ID_SIZE = 10;

class TimecardDataAccessor {
    #updateTimecardAttribute(timecard_id, attribute_key, new_attribute_value) {
        const url = timecard_url + timecard_id;
        const timecardObj = {};
        timecardObj[attribute_key] = new_attribute_value;

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(PATCH, url, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(timecardObj));

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // Timecard not found
        }

        return xmlhttp.responseText;
    }

    generateID() {
        var newID;
        try {
            newID = Math.floor(Math.random() * (9999999999)).toString();
            while (newID.length < ID_SIZE) newID = "0" + newID;
            this.getTimecard(newID);
            return this.generateID();
        } catch {
            return newID;
        }
    }

    clockIn(user_name, event_id, time_in) {
        const url = timecards_url;
        const timecardObj = {
            "id": this.generateID(),
            "userName": user_name.toLowerCase(),
            "eventId": event_id,
            "timeIn": time_in,
            "timeOut": "-1"
        };

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(POST, url, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(timecardObj));

        if (xmlhttp.status != 201) {
            throw new Error('Clock-in failed!');
        }

        return xmlhttp.responseText;
    }

    clockOut(time_out, timecard_id) {
        const url = timecard_url + timecard_id;
        const timecardObj = {
            timeOut: time_out
        };

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(PATCH, url, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(timecardObj));

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // Timecard not found
        }

        return xmlhttp.responseText;
    }

    getTimecard(timecard_id) {
        const url = timecard_url + timecard_id;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(GET, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // Timecard not found
        }

        return xmlhttp.responseText;
    }

    getTimecardsForUser(user_name) {
        const url = '/timecards/users/' + user_name;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(GET, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // Timecard for user does not exist
        }

        return xmlhttp.responseText;
    }

    getTimecardsForEvent(event_id) {
        const url = '/timecards/events/' + event_id;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(GET, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // Timecard for event does not exist
        }

        return xmlhttp.responseText;
    }

    deleteTimecard(timecard_id) {
        const url = timecard_url + timecard_id;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(DELETE, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 204) {
            throw NOT_FOUND; // Timecard not found
        }
    }

    updateTimeIn(timecard_id, new_time_in) {
        return this.#updateTimecardAttribute(timecard_id, TIME_IN, new_time_in);
    }

    updateTimeOut(timecard_id, new_time_out) {
        return this.#updateTimecardAttribute(timecard_id, TIME_OUT, new_time_out);
    }
}

module.exports = TimecardDataAccessor;
