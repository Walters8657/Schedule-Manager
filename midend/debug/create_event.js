const EventDataAccessor = require("../eventDataAccessor");
const ScheduleDataAccessor = require("../scheduleDataAccessor");

const e = new EventDataAccessor();
const s = new ScheduleDataAccessor();

eventId = JSON.parse(e.createEvent('Bananarama 2.5!',
                                   'The bananas are walking all around!',
                                   'Bananas',
                                   '2021-03-25 14:00',
                                   '2021-03-25 16:00',
                                   'Banana-room')).data.id;

// Create template event to be displayed on 'view events' page
e.createEvent('Bananarama 2!',
              'The bananas are walking all around! This event should be displayed on the view events page!',
              'Bananas',
              '',
              '',
              'Banana-room');

try{
    s.addEvent('testCHild', eventId);
    console.log('Event added to testchild timecard');
} catch (e) {
    console.log('User not found.');
}
