const baseUrl = require("./baseUrl.js");
const XMLHttpRequest = require('../example/node_modules/xmlhttprequest').XMLHttpRequest;

const schedules_url = baseUrl + '/schedules';
const schedule_url = baseUrl + '/schedule/';

const POST = 'POST';
const PATCH = 'PATCH';
const GET = 'GET';
const DELETE = 'DELETE';
const NOT_FOUND = 404;

const USER_NAME = 'userName';
const EVENTS = 'events';

class ScheduleDataAccessor {

    //Code to create new schedule
    createSchedule(user_name, events) {
        const url = schedules_url;
        const scheduleObj = {};
        scheduleObj[USER_NAME] = user_name;
        scheduleObj[EVENTS] = events;

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(POST, url, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(scheduleObj));

        if (xmlhttp.status != 201) {
            throw new Error("Schedule creation failed!");
        }

        return xmlhttp.responseText;
    }
    //Code to view one schedules
    getSchedule(user_name) {
        const url = schedule_url + user_name;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(GET, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // Schedule not found
        }

        return xmlhttp.responseText;
    }
    //Code to view all schedules
    getAllSchedules() {
        const url = schedules_url;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(GET, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // Schedule not found
        }

        return xmlhttp.responseText;
    }
    //Code to view events
    getEvents(user_name) {
        const get_response = JSON.parse(this.getSchedule(user_name));
        return get_response.data.events;
    }
    //Code to delete a schedule
    deleteSchedule(user_name) {
        const url = schedule_url + user_name;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(DELETE, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 204) {
            throw NOT_FOUND; // Schedule not found
        }
    }
    //Code to add events
    addEvent(user_name, new_event_id) {
        var events = this.getEvents(user_name);
        if (events != null) {
            events.push(new_event_id);
        } else {
            events = [new_event_id];
        }
        return this.overwriteEvents(user_name, events);

    }
    //Code to delete events
    removeEvent(user_name, event_id_to_remove) {
        var events = this.getEvents(user_name);

        if (events != null && events.includes(event_id_to_remove)) {
            if (events.length == 1) {
                return this.overwriteEvents(user_name, null);
            }
            events.splice(events.indexOf(event_id_to_remove), 1);
            return this.overwriteEvents(user_name, events);
        }
        return this.getSchedule(user_name);
    }
    //Code to change events
    overwriteEvents(user_name, new_events) {
        const url = schedule_url + user_name;
        const scheduleObj = { };
        scheduleObj[EVENTS] = new_events;

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(PATCH, url, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(scheduleObj));

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // Schedule not found
        }

        return xmlhttp.responseText;
    }
}

module.exports = ScheduleDataAccessor;
