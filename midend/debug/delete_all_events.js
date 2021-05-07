const EventDataAccessor = require("../eventDataAccessor");

const e = new EventDataAccessor();

const events = JSON.parse(e.getAllEvents()).data;

events.forEach(event => {
    e.deleteEvent(event.id);
});