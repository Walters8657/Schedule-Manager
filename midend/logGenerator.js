const EventDataAccessor = require("./eventDataAccessor");
const TimecardDataAccessor = require("./timecardDataAccessor");

class LogGenerator {
    constructor(user_name) {
        const eDA = new EventDataAccessor();
        const tDA = new  TimecardDataAccessor();

        const all_events = JSON.parse(eDA.getAllEvents()).data;
        var user_timecards = JSON.parse(tDA.getTimecardsForUser(user_name)).data;
        var user_activity = [];

        /*
        {
            event: {event name},
            timecardId: {timecard id},
            clockIn: {clock in time},
            clockOut: {clock out time}
        }
        */

        user_timecards.forEach(timecard => {
            var child_event = {};
            all_events.forEach(thisEvent => {
                if (thisEvent.id == timecard.eventId) {
                    child_event = thisEvent;
                }
            })

            if (child_event != {}) { 
                user_activity.push(
                    {
                        event: child_event.name,
                        timecardId: timecard.id,
                        timeIn: timecard.timeIn,
                        timeOut: timecard.timeOut
                    }
                )
            }
        })

        if (user_activity.length > 1) {
            user_activity.sort((a, b) => (new Date(a.timeIn).getTime() > new Date(b.timeIn).getTime()) ? -1 : 1)
        }

        this.user_log = user_activity;
    }

    getLog() {
        return this.user_log;
    }
}



module.exports = LogGenerator;