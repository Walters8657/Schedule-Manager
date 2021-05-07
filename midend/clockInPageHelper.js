const EventDataAccessor = require("./eventDataAccessor");
const ScheduleDataAccessor = require("./scheduleDataAccessor");
const TimecardDataAccessor = require("./timecardDataAccessor");

class ClockInPageHelper {
    constructor(user_name) {
        user_name = user_name.toLowerCase();
        const s = new ScheduleDataAccessor();
        const e = new EventDataAccessor();
        try {
            var eventIDList = s.getEvents(user_name);
        } catch (e) {
            // schedule not found
            var eventIDList = [];
        }
        try {
            var allEvents = JSON.parse(e.getAllEvents()).data;
        } catch (e) {
            // api error (events not found - this shouldn't happen)
            var allEvents = [];
        }
        var eventList = [];
        
        if (eventIDList && allEvents) {
            eventIDList.forEach(eventID => {
                allEvents.forEach(event => {
                    if (event.id == eventID) {
                        eventList.push(event);
                    }
                })
            });
        }

        if (eventList.length > 1) {
            eventList.sort((a, b) => (new Date(a.startTime).getTime() > new Date(b.startTime).getTime()) ? 1 : -1)
        }

        this.sortedEventList = eventList;

        const t = new TimecardDataAccessor();
        this.userTimecards = [];
        try {
            this.userTimecards = JSON.parse(t.getTimecardsForUser(user_name)).data;
        } catch (e) {
            // No timecards found... no big deal
        }
    }

    getPreviousEvent() {
        const currentTime = Date.now();

        var returnObj = null;
        var found = false;

        var previousEvent = null;
        this.sortedEventList.forEach(event => {
            if (!found && new Date(event.startTime).getTime() > currentTime) {
                returnObj = previousEvent;
                found = true;
            }
            // check if clocked out of event
            if (found) {
                var timecard = null;
                this.userTimecards.forEach(tc => {
                    if (tc.eventId == event.id) {
                        timecard = tc;
                    } 
                })

                if (timecard != null && timecard.timeOut > 0) {
                    returnObj = event;
                }
            }
            previousEvent = event;
        });

        if (returnObj == null) {
            return this.sortedEventList[this.sortedEventList.length-1];
        }
        return returnObj;
    }

    getCurrentEvent() {
        const currentTime = Date.now();

        var returnObj = null;
        var found = false;
        var getNext = false; // If this is true, set the next event as the object to return

        this.sortedEventList.forEach(event => {
            if (getNext) {
                returnObj = event;
                getNext = false;
            }

            if (!found && (new Date(event.endTime).getTime() > currentTime || 
                new Date(event.startTime).getTime() > currentTime)) {
                returnObj = event;
                found = true;
            }

            if (found) {
                var timecard = null;
                this.userTimecards.forEach(tc => {
                    if (tc.eventId == event.id) {
                        timecard = tc;
                    } 
                })

                if (timecard != null && timecard.timeOut > 0) {
                    getNext = true;
                }
            }
        });

        if (getNext) {
            return null;
        }
        return returnObj;
    }

    getNextEvent() {
        const currentTime = Date.now();

        var returnObj = null;
        var found = false;
        var loaded = false;

        this.sortedEventList.forEach(event => {
            if (found && !loaded) {
                returnObj = event;
                loaded = true;
            }

            if (!found && new Date(event.startTime).getTime() > currentTime) {
                found = true;
            }

            if (found) {
                var timecard = null;
                this.userTimecards.forEach(tc => {
                    if (tc.eventId == event.id) {
                        timecard = tc;
                    } 
                })

                if (timecard != null && timecard.timeOut > 0) {
                    found = false;
                }
            }
        });

        return returnObj;
    }

    getAll() {
        const currentTime = Date.now();

        var previousEvent = null;
        var found = false;
        var loaded = false;
        var returnObj = {
            previousEvent: null,
            currentEvent: null,
            nextEvent: null
        };

        this.sortedEventList.forEach(event => {
            if (found && !loaded) {
                returnObj.nextEvent = event;
                loaded = true;
            }

            if ((new Date(event.endTime).getTime() > currentTime || 
                new Date(event.startTime).getTime() > currentTime) && !found) {
                returnObj.previousEvent = previousEvent;
                returnObj.currentEvent = event;
                found = true;
            }

            if (found) {
                var timecard = null;
                this.userTimecards.forEach(tc => {
                    if (tc.eventId == event.id) {
                        timecard = tc;
                    } 
                })

                if (timecard != null && timecard.timeOut > 0) {
                    found = false;
                }
            }

            previousEvent = event;
        });

        if (!found) {
            returnObj.previousEvent = this.sortedEventList[this.sortedEventList.length-1];
        }
        
        return returnObj;
    }
}

module.exports = ClockInPageHelper;