var express = require('express');
const moment = require('moment');
const chart = require('chart.js');
const EventDataAccessor = require('../../midend/eventDataAccessor');
const UserDataAccessor = require('../../midend/userDataAccessor');
const ScheduleDataAccessor = require('../../midend/scheduleDataAccessor');
const TimecardDataAccessor = require('../../midend/timecardDataAccessor');
const LogGenerator = require('../../midend/logGenerator');

const { generatePassword } = require('../../midend/passwordGeneration');
const { generateUsername } = require('../../midend/usernameGenerator');

const { hashPassword } = require('../../midend/passwordGeneration.js');

var router = express.Router()

/*---------------------------------------------------------------------------------------------------------------------
    Staff home-page (View children)
*/
router.get('/', function(req, res) { //Url is 'localhost:8080/staff/'
    if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        //Allowed to see the /staff page
        console.log("get request home page");

        const u = new UserDataAccessor();
        try {
            var children = u.getAllChildren();
        } catch (e) {
            console.log('Error getting users - API most likely having issues.');
        }

        res.render('pages/staff/staffHome', {
            session: req.session,
            children: children
        });
    }
    //Not Allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else
        res.redirect("/login");
})

router.post('/', function(req, res) {
    console.log('home post request');
    req.session.childUserName = req.body.childUserName;

    if (req.body.method == "calendar") {
        res.redirect('/staff/viewcalendar');
    } else {
        res.redirect('/staff/logs');
    }
})

/*---------------------------------------------------------------------------------------------------------------------
    View child calendar page
*/
router.get('/viewcalendar', function(req, res) {
    if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        //Allowed to see the /staff page
        console.log("post request home page");

        var events = [];

        const eDA = new EventDataAccessor();
        const sDA = new ScheduleDataAccessor();

        var all_events = [];
        try {
            all_events = JSON.parse(eDA.getAllEvents()).data;
        } catch (e) {}

        // console.log(req.session.username);
        try {

            const u = new UserDataAccessor();
            var childUserData = JSON.parse(u.getUser(req.session.childUserName)).data; // The full API response to the GET request

            const schedule = JSON.parse(sDA.getSchedule(req.session.childUserName)).data;

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

        res.render('pages/staff/showChildCalendar', {
            session: req.session,
            events: events,
            childUserData: childUserData
        });
    }
    //Not Allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else
        res.redirect("/login");
})

router.post('/viewcalendar', function(req, res) {
    var userName = req.body.userName;

    const sDA = new ScheduleDataAccessor();
    try {
        sDA.removeEvent(userName, req.body.eventId);
    } catch (e) {}
    res.redirect('/staff/viewcalendar');
})

/*---------------------------------------------------------------------------------------------------------------------
    View all events on a calendar
*/
router.get('/viewallcalendar', function(req, res) {
    if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        //Allowed to see the /staff page

        var events = [];

        const eDA = new EventDataAccessor();
        const sDA = new ScheduleDataAccessor();

        var all_events = [];
        try {
            all_events = JSON.parse(eDA.getAllEvents()).data;
        } catch (e) {}

        // console.log(req.session.username);
        try {

            if (all_events != null) {
                all_events.forEach(one_event => {
                    var event = {};
                    event = one_event;
                    console.log("----------------");
                    console.log(event);
                    events.push({
                        title: event.name,
                        start: event.startTime,
                        end: event.endTime,
                        desc: event.description,
                        location: event.location,
                        id: event.id
                    })
                })
            }
        } catch (e) {}

        res.render('pages/staff/showAllCalendar', {
            session: req.session,
            events: events
        });
    }
    //Not Allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else
        res.redirect("/login");
})


router.post('/viewallcalendar', function(req, res) {
    var userName = req.body.userName;

    const sDA = new ScheduleDataAccessor();
    try {
        sDA.removeEvent(userName, req.body.eventId);
    } catch (e) {}
    res.redirect('/staff/viewcalendar');
})

/*---------------------------------------------------------------------------------------------------------------------
    Create reports page
*/
router.get('/createReports', function(req, res) { //Url is 'localhost:8080/staff/'
    if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        //Allowed to see the /staff/createReports page
        res.render('pages/staff/createReports', { session: req.session });
    }
    //Not Allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else
        res.redirect("/login");
})

/*---------------------------------------------------------------------------------------------------------------------
    Actual report page
*/
router.get('/report', function(req, res) {
    let events = new EventDataAccessor();
    let schedules = new ScheduleDataAccessor(); //Creates schedule accessor for all children
    let users = new UserDataAccessor();
    allSchedules = schedules.getAllSchedules();

    childList = JSON.parse(allSchedules).data;

    let childrenWithEvents = [];
    let eventList = [];
    let anEvent;

    //--------------------------
    //----Birthday Variables----
    let  userBirthYear;
    let userBirthMonth;
    let userBirthDay;
    let currentYear;
    let currentMonth;
    let currentDay;
    let userAge;

    let minAge = req.query.ageMin;
    let maxAge = req.query.ageMax;
    //--------------------------
    //--------------------------

    let requestedGender = req.query.gender;
    requestedGender = requestedGender.charAt(0);

    let userGender;

    let runningTotalEventTimeScheduled = 0;

    for (let child = 0; child < childList.length; child++) { //Runs through every child

        let hasPastEvent = false;

        let userBirthday;
        try {
            userBirthday = (users.getUserBirthday(childList[child].userName));
        } catch(e) {
            console.log('could not get birthday for ' + childList[child].userName);
            continue;
        }

        userBirthday = moment(userBirthday, 'YYYY[-]MM[-]DD').format('X');

        userBirthYear = parseInt(moment(userBirthday, 'X').format('YYYY'));
        userBirthMonth = parseInt(moment(userBirthday, 'X').format('MM'));
        userBirthDay = parseInt(moment(userBirthday, 'X').format('DD'));

        currentYear = parseInt(moment().format('YYYY'));
        currentMonth = parseInt(moment().format('MM'));
        currentDay = parseInt(moment().format('DD'));

        userAge = currentYear - userBirthYear - 1;

        if (currentMonth > userBirthMonth || (currentMonth == userBirthMonth && currentDay > userBirthDay)) {
            userAge++;
        }

        userGender = users.getUserGender(childList[child].userName);
        userGender = userGender.charAt(0);

        if (childList[child].events && (minAge <= userAge && userAge <= maxAge) && ((requestedGender == 'a') || (requestedGender == userGender))) { //If child has events
            for (let childEvent = 0; childEvent < childList[child].events.length; childEvent++) { //Loops through each childs events
                let eventID = childList[child].events[childEvent]; //Gets eventID of current event in loop

                try {
                    anEvent = JSON.parse(events.getEvent(eventID) ); //Gets entire event object
                } catch(e) {
                    continue;
                }

                if ((moment(anEvent.data.endTime).format('X') <= parseInt(req.query.endDate)) && (moment(anEvent.data.startTime).format('X') >= parseInt(req.query.startDate))) { //If events are in the designated time slot
                    let pushEvent = true;

                    runningTotalEventTimeScheduled += (moment(anEvent.data.endTime).format('X') - moment(anEvent.data.startTime).format('X'));

                    for (let i = 0; i < eventList.length; i++) { //Loops through existing events in list to make sure no duplicates added
                        if (eventList[i].data.id == anEvent.data.id)
                            pushEvent = false;
                    }
                    if (pushEvent)
                        eventList.push(anEvent); //Adds event to list

                    hasPastEvent = true; //Tracks if child has past event
                } //Compare the id instead of the entire object

            }
        }
        if (hasPastEvent) {
            childrenWithEvents.push(childList[child]); //Adds children with past events to childrenWithEvents array
        }
    }

    let timecard = new TimecardDataAccessor();
    let actualRunningTimeForEvent = runningTotalEventTimeScheduled;

    let arrival = {
        'onTime': 0,
        'fiveMinutesLate': 0,
        'overFiveMinutesLate': 0
    }

    let departure = {
        'afterEnd': 0,
        'fiveMinutesEarly': 0,
        'overFiveMinutesEarly': 0
    }

    for (let x = 0; x < eventList.length; x++) {
        let timeCardData;
        try {
            timeCardData = JSON.parse(timecard.getTimecardsForEvent(eventList[x].data.id));
        } catch (e) {
            console.log('could not get timecards for event ' + eventList[x].data.id);
            continue;
        }

        timeCardData.data.forEach(timeCard => {
            childrenWithEvents.forEach(childWithEvents => {
                if (childWithEvents.userName == timeCard.userName) {
                    let startDiff = (moment(timeCard.timeIn, 'x').format('X') - parseInt(moment(eventList[x].data.startTime).format('X')));
                    let endDiff = (moment(timeCard.timeOut, 'x').format('X') - parseInt(moment(eventList[x].data.endTime).format('X')));

                    actualRunningTimeForEvent -= startDiff;
                    actualRunningTimeForEvent += endDiff;

                    if (startDiff < 0) {
                        arrival.onTime++;
                    } else if (startDiff < 5 * 60) {
                        arrival.fiveMinutesLate++;
                    } else {
                        arrival.overFiveMinutesLate++;
                    }

                    if (endDiff > 0) {
                        departure.afterEnd++;
                    } else if (endDiff > -5 * 60) {
                        departure.fiveMinutesEarly++;
                    } else {
                        departure.overFiveMinutesEarly++;
                    }

                }
            })

        })
    }

    let percentageOfEventTimeAttended = (actualRunningTimeForEvent / runningTotalEventTimeScheduled);

        // console.log('Running time Target: ' + runningTotalEventTimeScheduled + ' seconds');
        // console.log('Actual Time in Events: ' + actualRunningTimeForEvent + ' seconds');
        // console.log(percentageOfEventTimeAttended.toFixed(2) + '% Attendance Time');
        // console.log(arrival);
        // console.log(departure);

    res.render('pages/staff/report', { session: req.session, arrival: arrival, departure: departure });
});

/*---------------------------------------------------------------------------------------------------------------------
    View event presets page
*/
router.get('/viewEvent', function(req, res) { //Url is 'localhost:8080/staff/'
    if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        //Allowed to see the /staff/viewEvent page
        var eDA = new EventDataAccessor();
        let events;
        try {
            events = JSON.parse(eDA.getAllEvents()).data;
        } catch (e) {
            events = [];
        }

        res.render('pages/staff/viewEvent', {
            events: events,
            session: req.session
        });
    }
    //Not allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else
        res.redirect("/login");
})

router.post('/viewEvent', function(req, res) { //Url is 'localhost:8080/staff/'


    console.log('View event post request');
    console.log("eventIDToEdit:" + req.body.eventIDToEdit);

    req.session.eventIDToEdit = req.body.eventIDToEdit;
    res.redirect('/staff/editEventPreset');
})

/*---------------------------------------------------------------------------------------------------------------------
    Edit event preset page
*/
router.get('/editEventPreset', function(req, res) { //Url is 'localhost:8080/staff/'
    if ((req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        //Allowed to see the /staff/editEventPreset page

        var eDA = new EventDataAccessor();
        req.session.eventDataToEdit = (JSON.parse(eDA.getEvent(req.session.eventIDToEdit))).data;
        console.log("eventToEdit: " + JSON.stringify(req.session.eventDataToEdit));
        res.render('pages/staff/editEventPreset', {
            session: req.session,
        });
    }
    //Not Allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else if (req.session.userPermission == "lowStaff")
        res.redirect("/staff");
    else
        res.redirect("/login");
})

router.post('/editEventPreset', function(req, res) {
    console.log("Edit Event Preset Post");

    const eDA = new EventDataAccessor();
    try {
        console.log(req.body);
        if (req.body.operation == 'update') {
            eDA.updateEventName(req.session.eventDataToEdit.id, req.body.name);
            eDA.updateDescription(req.session.eventDataToEdit.id, req.body.description);
            eDA.updateLocation(req.session.eventDataToEdit.id, req.body.location);
        } else if (req.body.operation == 'delete') {
            eDA.deleteEvent(req.body.eventIDToDelete);
        }

        res.redirect('/staff/viewEvent');
    } catch (e) {
        console.log('Something went oopsies!!!');
    }
})

/*---------------------------------------------------------------------------------------------------------------------
    Create event preset page
*/
router.get('/createEvent', function(req, res) { //Url is 'localhost:8080/staff/'
    if ((req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        //Allowed to see the /staff/createEvent page
        res.render('pages/staff/createEvent', { session: req.session });
    }
    //Not Allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else if (req.session.userPermission == "lowStaff")
        res.redirect("/staff");
    else
        res.redirect("/login");
})

router.post('/createEvent', function(req, res) {
    const e = new EventDataAccessor();
    try {
        e.createEvent(req.body.name, req.body.description, "", "", "", req.body.location);
        res.redirect('/staff/viewEvent');
    } catch (e) {
        console.log('Something went oopsies!!!');
    }
})

/*---------------------------------------------------------------------------------------------------------------------
    Schedule event page
*/
router.get('/scheduleEvent', function(req, res) { //Url is 'localhost:8080/staff/'
    if ((req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        //Allowed to see the /staff/scheduleEvent page
        var children = [];
        const u = new UserDataAccessor();

        try {
            var complete_children = u.getAllChildren();
            complete_children.forEach(child => {
                children.push({
                    id: child.userName,
                    firstName: child.fName.toLowerCase().charAt(0).toUpperCase() + child.fName.slice(1),
                    lastName: child.lName.toLowerCase().charAt(0).toUpperCase() + child.lName.slice(1),
                    age: ~~((Date.now() - new Date(child.birthday)) / (31557600000)),
                    gender: child.gender
                });
            });
        } catch (e) {
            console.log('Error getting users - API most likely having issues.');
        }

        var events = [];
        const e = new EventDataAccessor();

        try {
            var complete_events = JSON.parse(e.getAllEvents()).data;

            complete_events.forEach(event => {
                events.push({
                    value: event.id,
                    eventName: event.name
                });
            })
        } catch (e) {
            console.log('Error getting events - API most likely having issues.');
        }

        res.render('pages/staff/scheduleEvent', {
            session: req.session,
            children: children,
            events: events,
            complete_events: complete_events
        });
    }
    //Not allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else if (req.session.userPermission == "lowStaff")
        res.redirect("/staff");
    else
        res.redirect("/login");
})

router.post('/scheduleEvent', function(req, res) {
    const s = new ScheduleDataAccessor();
    const e = new EventDataAccessor();

    console.log('Adding event to schedule(s)');

    // fix date format for event
    var date = new Date(req.body.startTime);
    var formattedStartTime =
        date.getFullYear() + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2);

    date = new Date(req.body.endTime);
    var formattedEndTime =
        date.getFullYear() + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2);

    try {
        eventTemplate = JSON.parse(e.getEvent(req.body.eventId)).data;
        var newEvent = {
            name: eventTemplate.name,
            description: eventTemplate.description,
            category: eventTemplate.name,
            startTime: formattedStartTime,
            endTime: formattedEndTime
        }

        if (req.body.eventLocation == "") {
            newEvent.location = eventTemplate.location;
        } else {
            newEvent.location = req.body.eventLocation;
        }

        if (req.body.description == "") {
            newEvent.description = eventTemplate.description;
        } else {
            newEvent.description = req.body.description;
        }

        if ([newEvent.name, newEvent.description, newEvent.startTime, newEvent.endTime, newEvent.location].includes("")) {
            res.redirect('/staff/scheduleEvent');
        } else {
            newEventId = JSON.parse(e.createEvent(newEvent.name, newEvent.description, newEvent.category, newEvent.startTime, newEvent.endTime, newEvent.location)).data.id;

            // Add event to each child's schedule
            JSON.parse(req.body.users).forEach(user => {
                s.addEvent(user, newEventId);
            })
        }
    } catch (e) {
        console.log('error');
    }
    res.redirect('/staff/viewSchedule');
})

/*---------------------------------------------------------------------------------------------------------------------
    View scheduled events page
*/
router.get('/viewSchedule', function(req, res) { //Url is 'localhost:8080/staff/'
    if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        //Allowed to see the /staff/viewSchedule page

        var eDA = new EventDataAccessor();
        let events;
        try {
            events = JSON.parse(eDA.getAllEvents()).data;
        } catch (e) {
            events = [];
        }

        var sortedEvents = eDA.sortByStartTime(events);

        res.render('pages/staff/viewScheduledEvents', {
            events: sortedEvents,
            session: req.session
        });
    }
    //Not allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else
        res.redirect("/login");
})

router.post('/viewSchedule', function(req, res) { //Url is 'localhost:8080/staff/'
    console.log('View schedule post request');
    console.log("eventIDToEdit:" + req.body.eventIDToEdit);

    req.session.eventIDToEdit = req.body.eventIDToEdit;
    res.redirect('/staff/editScheduledEvent');

})

/*---------------------------------------------------------------------------------------------------------------------
    Edit a scheduled event page
*/
router.get('/editScheduledEvent', function(req, res) { //Url is 'localhost:8080/staff/'
    if ((req.session.userPermission == "upStaff") || (req.session.userPermission == "sysOverseer")) {
        //Allowed to see the /staff/editEventPreset page

        // Get all schedules
        const sDA = new ScheduleDataAccessor();
        var schedules = [];
        try {
            schedules = JSON.parse(sDA.getAllSchedules()).data;
        } catch (e) {}

        // Get all schedules with eventDataToEdit.id in em
        var childrenTicked = {};
        schedules.forEach(schedule => {
            if (schedule.events != null && schedule.events.includes(req.session.eventIDToEdit)) {
                childrenTicked[schedule.userName] = true;
            }
        })

        // Get list of children and whether or not they are ticked
        const uDA = new UserDataAccessor();
        var children = [];
        var childrenBase = [];
        try {
            var childrenBase = uDA.getAllChildren();
        } catch (e) {
            console.log('error getting children');
        }

        console.log(childrenBase);

        childrenBase.forEach(child => {
            children.push({
                "userName": child.userName,
                "fName": child.fName,
                "lName": child.lName
            });
        })

        children.forEach(child => {
            if (!childrenTicked.hasOwnProperty(child.userName)) {
                childrenTicked[child.userName] = false;
            }
        })

        var eDA = new EventDataAccessor();
        req.session.eventDataToEdit = (JSON.parse(eDA.getEvent(req.session.eventIDToEdit))).data;
        console.log("eventToEdit: " + JSON.stringify(req.session.eventDataToEdit));
        res.render('pages/staff/editScheduledEvent', {
            session: req.session,
            children: children,
            childrenTicked: childrenTicked
        });
    }
    //Not Allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else if (req.session.userPermission == "lowStaff")
        res.redirect("/staff");
    else
        res.redirect("/login");
})

router.post('/editScheduledEvent', function(req, res) {
    console.log("Edit Event Preset Post");

    const eDA = new EventDataAccessor();
    const tDA = new TimecardDataAccessor();
    const sDA = new ScheduleDataAccessor();
    const uDA = new UserDataAccessor();
    try {
        if (req.body.operation == 'update') {
            var originalTickedChildren = JSON.parse(req.body.originalTickedChildren);
            var newTickedChildren = JSON.parse(req.body.users);
            var nonTickedChildren = [];

            try {
                var users = uDA.getAllChildren();
                users.forEach(user =>{
                    if (!newTickedChildren.includes(user.userName)) {
                        nonTickedChildren.push(user.userName);
                    }
                })
            } catch (e) {}

            newTickedChildren.forEach(child => {
                if (originalTickedChildren[child] == false) {
                    try {
                        sDA.addEvent(child, req.session.eventIDToEdit);
                    } catch (e) {}
                }
            })

            nonTickedChildren.forEach(child => {
                if (originalTickedChildren[child] == true) {
                    try {
                        sDA.removeEvent(child, req.session.eventIDToEdit);
                    } catch (e) {}
                }
            })

            eDA.updateEventName(req.session.eventDataToEdit.id, req.body.name);
            eDA.updateDescription(req.session.eventDataToEdit.id, req.body.description);
            eDA.updateLocation(req.session.eventDataToEdit.id, req.body.location);
            eDA.updateStartTime(req.session.eventDataToEdit.id, req.body.timeStart);
            eDA.updateEndTime(req.session.eventDataToEdit.id, req.body.timeEnd);
        } else if (req.body.operation == 'delete') {
            // delete event
            try {
                eDA.deleteEvent(req.body.eventIDToDelete);
            } catch (e) {console.log('error deleting event ' + req.body.eventIDToDelete);}

            // delete timecards associated with event
            var timecards = [];
            try {
                timecards = JSON.parse(tDA.getTimecardsForEvent(req.body.eventIDToDelete)).data;
            } catch (e) {console.log('error getting timecards for event ' + req.body.eventIDToDelete);}
            timecards.forEach(timecard => {
                try {
                    tDA.deleteTimecard(timecard.id);
                } catch (e) {
                    console.log('error delete timecard ' + timecard.id);
                }
            })

            // Remove event from children's schedules
            var children = [];
            try {
                children = uDA.getAllChildren();
            } catch (e) {console.log('error getting all children');}

            children.forEach(child => {
                try {
                    sDA.removeEvent(child.userName, req.body.eventIDToDelete);
                } catch (e) {console.log("error removing event " + req.body.eventIDToDelete + " from schedule " + child.userName);}
            })
        }

        res.redirect('/staff/viewSchedule');
    } catch (e) {
        console.log('Something went oopsies!!!');
    }
})

/*---------------------------------------------------------------------------------------------------------------------
    Create account page
*/
router.get('/createAccount', function(req, res) { //Url is 'localhost:8080/staff/'
    if (req.session.userPermission == "sysOverseer") {
        //Allowed to see the /staff/createAccount page
        var usernames = [];
        const uDA = new UserDataAccessor();
        var users = JSON.parse(uDA.getAllUsers()).data;
        users.forEach(user => {
            usernames.push(user.userName);
        })
        res.render('pages/staff/createAccount', {
            session: req.session,
            usernames: JSON.stringify(usernames)
        });
    }
    //Not allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff"))
        res.redirect("/staff");
    else
        res.redirect("/login");
})

router.post('/createAccount', function(req, res) {
    console.log('post request');
    const u = new UserDataAccessor();
    try {

        /* Old Username/Password generator
        var newUserName;
        var newPassword;

        if (req.body.username == "")
          newUserName = generateUsername(req.body.fname, req.body.lname);
        else
          newUserName = req.body.username;

        if (req.body.password == "")
          newPassword = generatePassword();
        else
          newPassword = req.body.password;
        */

        console.log(req.body);
        //console.log("New username = " + req.body.userName + "\nNew password = " + req.body.password);
        saltHash = hashPassword(req.body.password);

        //Require a first and last name to create the account
        if ((req.body.fname != "") && (req.body.lname != "")) {
            // Correctly store gender as a character
            var gender = 'o';
            switch (req.body.gender.toLowerCase()) {
                case "male":
                    gender = 'm';
                    break;
                case "female":
                    gender = 'f';
                default:
                    break;
            }
            u.createUser(req.body.userName, req.body.fname, req.body.lname, req.body.permissions, gender, req.body.birthDate, [], saltHash.salt, saltHash.hash);
            res.redirect('/staff/manageAccount');
        }
        //If a first and last name are not provided, don't create the account
        else
            res.redirect('/staff/manageAccount');

    } catch (e) {
        console.log('Something went oopsies!!!');
    }
})

/*---------------------------------------------------------------------------------------------------------------------
    Edit account page
*/
router.get('/editAccount', function(req, res) {
    if (req.session.userPermission == "sysOverseer") {

        const u = new UserDataAccessor();
        try {
            var originalUser = (JSON.parse(u.getUser(req.session.originalUsername))); // The full API response to the GET request
            req.session.originalUserData = originalUser.data; // Just the relevant info from the API response
        } catch (e) {}

        var numberOfOverseers = 0;
        try {
            var allStaff = u.getAllStaff();

            allStaff.forEach(user => {
                if (user.permission == 'sysOverseer') {
                    numberOfOverseers += 1;
                }
            })
        } catch (e) {}

        //Allowed to see the /staff/createAccount page
        res.render('pages/staff/editAccount', {
            session: req.session,
            overseerCount: numberOfOverseers
        });
    }
    //Not allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff"))
        res.redirect("/staff");
    else
        res.redirect("/login");

})

router.post('/editAccount', function(req, res) {
    console.log('editAccount post request');
    const u = new UserDataAccessor();
    const t = new TimecardDataAccessor();
    const s = new ScheduleDataAccessor();
    try {
        if (req.body.operation == 'update') {
            saltHash = hashPassword(req.body.password);

            //Require a first and last name to create the account
            if ((req.body.fname != "") && (req.body.lname != "")) {
                u.updateFirstName(req.session.originalUsername, req.body.fname);
                u.updateLastName(req.session.originalUsername, req.body.lname);
                u.updatePermission(req.session.originalUsername, req.body.permissions);
                u.updateGender(req.session.originalUsername, req.body.gender);
                u.updateBirthday(req.session.originalUsername, req.body.birthDate);

                if (req.body.password != '') {
                    u.updateSalt(req.session.originalUsername, saltHash.salt);
                    u.updateHash(req.session.originalUsername, saltHash.hash);
                }

                res.redirect('/staff/manageAccount');
            }
            //If a first and last name are not provided, don't update the account
            else
                res.redirect('/staff/manageAccount');
        } else if (req.body.operation == 'delete') {
            console.log("delete please");

            // Delete user from db
            try {
                u.deleteUser(req.session.originalUsername);
            } catch (e) {}

            // Delete user's schedule from db
            try {
                s.deleteSchedule(req.session.originalUsername);
            } catch (e) {}

            // Delete user's timecards from db
            var timecards = [];
            try {
                var timecards = JSON.parse(t.getTimecardsForUser(req.session.originalUsername)).data;
            } catch (e) {}
            timecards.forEach(timecard => {
                try {
                    t.deleteTimecard(timecard.id);
                } catch (e) {}
            })
        }

    } catch (e) {
        console.log('Something went oopsies!!!');
    }
})

/*---------------------------------------------------------------------------------------------------------------------
    Manage account page (shows every account)
*/
router.get('/manageAccount', function(req, res) { //Url is 'localhost:8080/staff/'
    if (req.session.userPermission == "sysOverseer") {
        //Allowed to see the /staff/manageAccount page
        const u = new UserDataAccessor();
        try {
            var childrenAndStaff = u.getAllChildrenAndStaff();
        } catch (e) {
            console.log('Something went oopsies!!!');
        }

        res.render('pages/staff/manageAccount', {
            session: req.session,
            children: childrenAndStaff.children,
            staff: childrenAndStaff.staff
        });
    }
    //Not allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else if ((req.session.userPermission == "lowStaff") || (req.session.userPermission == "upStaff"))
        res.redirect("/staff");
    else
        res.redirect("/login");
})

router.post('/manageAccount', function(req, res) {
    console.log('manage account post request');
    console.log("original username:" + req.body.originalUsername);

    req.session.originalUsername = req.body.originalUsername;

    res.redirect('/staff/editAccount');

})

/*---------------------------------------------------------------------------------------------------------------------
    Logs page for a specific child
*/
router.get('/logs', function(req, res) {
    if (["lowStaff", "upStaff", "sysOverseer"].includes(req.session.userPermission)) {
        var logs = [];
        try {
            var logGenerator = new LogGenerator(req.session.childUserName);
            logs = logGenerator.getLog();
        } catch (e) {}

        var fName = '';
        var lName = '';

        try {
            const uDA = new UserDataAccessor();
            const user = JSON.parse(uDA.getUser(req.session.childUserName)).data;
            fName = user.fName;
            lName = user.lName
        } catch (e) {}

        res.render('pages/staff/logs', {
            session: req.session,
            logs: logs,
            fName: fName,
            lName: lName
        });
    }
    //Not allowed
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else
        res.redirect("/login");
})

router.post('/logs', function(req, res) {
    req.session.timecardId = req.body.timecardId;
    res.redirect('/staff/editTimecard');
})

/*---------------------------------------------------------------------------------------------------------------------
    Edit a timecard page
*/
router.get('/editTimecard',function(req, res) {
    //Not allowed
    if (["lowStaff", "upStaff", "sysOverseer"].includes(req.session.userPermission)) {
        const t = new TimecardDataAccessor();
        var originalTimecard = {};
        try {
            var originalTimecard = (JSON.parse(t.getTimecard(req.session.timecardId))); // The full API response to the GET request
        } catch (e) {}
        req.session.originalTimecardData = originalTimecard.data; // Just the relevant info from the API response

        const u = new UserDataAccessor();
        const e = new EventDataAccessor();
        var eventName = '';
        var fName, lName = '';

        try {
            eventName = JSON.parse(e.getEvent(originalTimecard.data.eventId)).data.name;
        } catch (e) {console.log('Error getting event name');}
        try {
            const user = JSON.parse(u.getUser(originalTimecard.data.userName)).data;
            fName = user.fName;
            lName = user.lName;
        } catch (e) {console.log('Error getting user info');}


        res.render('pages/staff/editTimecard', {
            session: req.session,
            fName: fName,
            lName: lName,
            eventName: eventName
        });
    }
    else if (req.session.userPermission == "child")
        res.redirect("/children");
    else
        res.redirect("/login");
})

router.post('/editTimecard',function(req, res) {
    const tDA = new TimecardDataAccessor();
    try {
        tDA.updateTimeIn(req.body.timecardId, req.body.timeIn);
        tDA.updateTimeOut(req.body.timecardId, req.body.timeOut);

        res.redirect('/staff/logs');
    } catch (e) {
        console.log('Something went oopsies!!!');
    }
})

module.exports = router
