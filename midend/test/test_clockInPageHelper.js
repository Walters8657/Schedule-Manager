const ClockInPageHelper = require("../clockInPageHelper");
const EventDataAccessor = require("../eventDataAccessor");
const ScheduleDataAccessor = require("../scheduleDataAccessor");
const TimecardDataAccessor = require("../timecardDataAccessor");
const USER_NAME = 'testtesttest';
const PREVIOUS = 'previous';
const CURRENT = 'current';
const NEXT = 'next';

// Set up
console.log('Setting up test...');
const s = new ScheduleDataAccessor();
const e = new EventDataAccessor();
const event_1 = JSON.parse(e.createEvent(PREVIOUS, PREVIOUS, PREVIOUS, '2021-04-11 14:00', '2021-04-11 15:00', PREVIOUS)).data.id;
const event_2 = JSON.parse(e.createEvent(CURRENT, CURRENT, CURRENT, '2021-04-12 14:00', '2021-04-12 15:00', CURRENT)).data.id;
const event_3 = JSON.parse(e.createEvent(NEXT, NEXT, NEXT, '2021-04-27 14:00', '2021-04-27 15:00', NEXT)).data.id;
s.createSchedule(USER_NAME, [event_1, event_2, event_3]);
const t = new TimecardDataAccessor();
const tcId = JSON.parse(t.clockIn(USER_NAME, event_2, new Date().getTime())).data.id;
t.clockOut(new Date().getTime(), tcId);

// Create helper obj
var helper = new ClockInPageHelper(USER_NAME);

// Get previous event
console.log('Getting previous event...');
console.log(helper.getPreviousEvent());

// Get current event
console.log('Getting current event...');
console.log(helper.getCurrentEvent());

// Get next event
console.log('Getting next event...');
console.log(helper.getNextEvent());

// Get object containing previous, current, and next events 
// *Slightly more efficient way of doing this if you need all at once
console.log('\nGetting object containing previous, current, and next');
const clockInPage = helper.getAll();

console.log('Previous:');
console.log(clockInPage.previousEvent);

console.log('Current:');
console.log(clockInPage.currentEvent);

console.log('Next:');
console.log(clockInPage.nextEvent);

// Clean up
console.log('Cleaning up...');
e.deleteEvent(event_1);
e.deleteEvent(event_2);
e.deleteEvent(event_3);
s.deleteSchedule(USER_NAME);