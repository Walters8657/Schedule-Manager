const UserDataAccessor = require("../userDataAccessor");
const EventDataAccessor = require("../eventDataAccessor");
const TimecardDataAccessor = require("../timecardDataAccessor");
const LogGenerator = require("../logGenerator");

const USER_NAME = 'test_person_lol';

console.log('Setting up...');
const uDA = new UserDataAccessor();
uDA.createUser(USER_NAME, 'test','person','awdad','m','test', [], '123123', '124124');

const e = new EventDataAccessor();
const event_1 = JSON.parse(e.createEvent('test_event1', 'test', 'foo', '2021-03-12 14:00', '2021-03-12 15:00', 'test')).data.id;
const event_2 = JSON.parse(e.createEvent('test_event2', 'test', 'foo', '2021-03-12 14:00', '2021-03-12 15:00', 'test')).data.id;
const event_3 = JSON.parse(e.createEvent('test_event3', 'test', 'foo', '2021-03-12 14:00', '2021-03-12 15:00', 'test')).data.id;

const tDA = new TimecardDataAccessor();
try {
    var timeCardsForTestUser = JSON.parse(tDA.getTimecardsForUser(USER_NAME)).data;
    // clean up any possible timecards for this user
    timeCardsForTestUser.forEach(timecard => {
        
            tDA.deleteTimecard(timecard.id);
    })
} catch (e) {}
const timecard2 = JSON.parse(tDA.clockIn(USER_NAME, event_2, Date.now().toString())).data.id;
tDA.clockOut(Date.now().toString(), timecard2);
const timecard3 = JSON.parse(tDA.clockIn(USER_NAME, event_3, Date.now().toString())).data.id;
tDA.clockOut(Date.now().toString(), timecard3);
const timecard1 = JSON.parse(tDA.clockIn(USER_NAME, event_1, Date.now().toString())).data.id;
tDA.clockOut(Date.now().toString(), timecard1);

console.log('getting log... (Should be test event1, 2, then 3)');

var logGen = new LogGenerator(USER_NAME);

console.log(logGen.getLog());

console.log('cleaning up...');
tDA.deleteTimecard(timecard1);
tDA.deleteTimecard(timecard2);
tDA.deleteTimecard(timecard3);

e.deleteEvent(event_1);
e.deleteEvent(event_2);
e.deleteEvent(event_3);

uDA.deleteUser(USER_NAME);