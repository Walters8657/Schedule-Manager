var express = require('express');
const ClockInPageHelper = require('../../midend/clockInPageHelper.js');
var EventDataAccessor = require('./../../midend/eventDataAccessor.js');
var ScheduleDataAccessor = require('./../../midend/scheduleDataAccessor.js');
var TimecardDataAccessor = require('./../../midend/timecardDataAccessor.js');
var router = express.Router()

/*---------------------------------------------------------------------------------------------------------------------
    Children home-page (Calendar view)
*/
router.get('/', function(req, res) { //Url is 'localhost:8080/children/'
    if (req.session.userPermission == "child") {
        var events = [];

        const eDA = new EventDataAccessor();
        const sDA = new ScheduleDataAccessor();
        const tDA = new TimecardDataAccessor();

        var userTimecardList = [];
        try {
            userTimecardList = JSON.parse(tDA.getTimecardsForUser(req.session.username)).data;
        } catch (e) {}

        var all_events = [];
        try {
            all_events = JSON.parse(eDA.getAllEvents()).data;
        } catch (e) {}

        console.log(req.session.username);
        try {
            const schedule = JSON.parse(sDA.getSchedule(req.session.username)).data;

            if (schedule.events != null) {
                schedule.events.forEach(eventId => {

                    try {
                        var event = {};
                        all_events.forEach(one_event => {
                            if (one_event.id == eventId) {
                                event = one_event;
                            }
                        })

                        if (event.id) { //only push if event has stuff!
                            events.push({
                                title: event.name,
                                start: event.startTime,
                                end: event.endTime,
                                desc: event.description,
                                location: event.location,
                                id: event.id
                            })
                        }
                    } catch (e) {}
                });
            }
        } catch (e) {}

        res.render('pages/children/childHome', {
            events: events,
            timecards: userTimecardList,
            session: req.session
        });
    } else if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        res.redirect("/staff");
    } else
        res.redirect("/login");
});

router.post('/', function(req, res) {
    console.log('post request');
    const t = new TimecardDataAccessor();
    if (req.body.clock == 'out') { // clock out
        var eventTimecards = null;
        try {
            var eventTimecards = JSON.parse(t.getTimecardsForEvent(req.body.eventId)).data;
        } catch (e) {} // event/api error

        var userTimecard = null;
        if (eventTimecards != null) {
            eventTimecards.forEach(timecard => {
                if (timecard.userName == req.body.userName) {
                    userTimecard = timecard;
                }
            })
        }

        try {
            t.clockOut(req.body.timeOut, userTimecard.id);
        } catch (e) {}
    } else { // clock in
        try {
            t.clockIn(req.body.userName, req.body.eventId, req.body.timeIn);
        } catch (e) {
            console.log('error clocking in');
        }
    }
})

/*---------------------------------------------------------------------------------------------------------------------
    Clock-in/out page
*/
router.get('/checkInOut', function(req, res) { //Url is 'localhost:8080/children/'
    if (req.session.userPermission == "child") {
        var clockInPageHelper = new ClockInPageHelper(req.session.username);
        const clockInObj = clockInPageHelper.getAll();
        const timecardDataAccessor = new TimecardDataAccessor();

        res.render('pages/children/checkInOut', {
            session: req.session,
            pastEvent: clockInObj.previousEvent,
            currentEvent: clockInObj.currentEvent,
            nextEvent: clockInObj.nextEvent,
            timecardDataAccessor: timecardDataAccessor
        });
    } else if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        res.redirect("/staff");
    } else
        res.redirect("/login");
})

router.post('/checkInOut', function(req, res) {
    console.log('post request');
    const t = new TimecardDataAccessor();
    if (req.body.clock == 'out') { // clock out
        var eventTimecards = null;
        try {
            var eventTimecards = JSON.parse(t.getTimecardsForEvent(req.body.eventId)).data;
        } catch (e) {} // event/api error

        var userTimecard = null;
        if (eventTimecards != null) {
            eventTimecards.forEach(timecard => {
                if (timecard.userName == req.body.userName) {
                    userTimecard = timecard;
                }
            })
        }

        try {
            t.clockOut(req.body.timeOut, userTimecard.id);
        } catch (e) {}
    } else { // clock in
        try {
            t.clockIn(req.body.userName, req.body.eventId, req.body.timeIn);
        } catch (e) {}
    }
})

module.exports = router