- [CAHSM API Midend stuff](#cahsm-api-midend-stuff)
  * [What is this?](#what-is-this-)
- [Testing](#testing)
  * [Test Output](#test-output)
- [Files and their functions](#files-and-their-functions)
  * [baseUrl](#baseurl)
  * [clockInPageHelper](#clockinpagehelper)
    + [`new ClockInPageHelper(<user_name>)`](#-new-clockinpagehelper--user-name---)
    + [`.getPreviousEvent()`](#-getpreviousevent---)
    + [`.getCurrentEvent()`](#-getcurrentevent---)
    + [`.getNextEvent()`](#-getnextevent---)
    + [`.getAll()`](#-getall---)
  * [eventDataAccessor](#eventdataaccessor)
    + [`new EventDataAccessor()`](#-new-eventdataaccessor---)
    + [`.createEvent(<event name>, <description>, <category>, <start time (YYYY-MM-DD hh:ss)>, <end time (YYYY-MM-DD hh:ss)>, <location>)`](#-createevent--event-name----description----category----start-time--yyyy-mm-dd-hh-ss-----end-time--yyyy-mm-dd-hh-ss-----location---)
    + [`.getEvent(<event ID>)`](#-getevent--event-id---)
    + [`.getAllEvents()`](#-getallevents---)
    + [`.updateEventName(<event ID>, <new event name>)`](#-updateeventname--event-id----new-event-name---)
    + [`.updateDescription(<event ID>, <new description>)`](#-updatedescription--event-id----new-description---)
    + [`.updateCategory(<event ID>, <new category>)`](#-updatecategory--event-id----new-category---)
    + [`.updateStartTime(<event ID>, <new start time>)`](#-updatestarttime--event-id----new-start-time---)
    + [`.updateEndTime(<event ID>, <new end time>)`](#-updateendtime--event-id----new-end-time---)
    + [`.updateLocation(<event ID>, <new location>)`](#-updatelocation--event-id----new-location---)
    + [`.deleteEvent(<event ID>)`](#-deleteevent--event-id---)
  * [logGenerator](#loggenerator)
    + [`new LogGenerator(<user name>)`](#-new-loggenerator--user-name---)
    + [`.getLog()`](#-getlog---)
  * [logIn](#login)
    + [`isPasswordCorrect(<user name>, <inputted password>)`](#-ispasswordcorrect--user-name----inputted-password---)
  * [passwordGeneration](#passwordgeneration)
    + [`hashPassword(<password>)`](#-hashpassword--password---)
    + [`generatePassword(<optional length (auto-set to 10)>)`](#-generatepassword--optional-length--auto-set-to-10----)
  * [permissionCheck](#permissioncheck)
    + [`checkForPermission(<username>, <permission>)`](#-checkforpermission--username----permission---)
    + [`getUserPermission(<username>)`](#-getuserpermission--username---)
  * [scheduleDataAccessor](#scheduledataaccessor)
    + [`new ScheduleDataAccessor()`](#-new-scheduledataaccessor---)
    + [`.createSchedule(<username>, <events (list of event IDs)>)`](#-createschedule--username----events--list-of-event-ids----)
    + [`.getSchedule(<username>)`](#-getschedule--username---)
    + [`.getEvents(<username>)`](#-getevents--username---)
    + [`.addEvent(<username>, <new event ID>)`](#-addevent--username----new-event-id---)
    + [`.removeEvent(<username>, <event ID to remove>)`](#-removeevent--username----event-id-to-remove---)
    + [`.overwriteEvents(<username>, <new list of event IDs>)`](#-overwriteevents--username----new-list-of-event-ids---)
  * [timecardDataAccessor](#timecarddataaccessor)
    + [`new TimecardDataAccessor()`](#-new-timecarddataaccessor---)
    + [`.generateID()`](#-generateid---)
    + [`.clockIn(<username>, <event ID>, <time in>)`](#-clockin--username----event-id----time-in---)
    + [`.clockOut(<time out>, <timecard ID>)`](#-clockout--time-out----timecard-id---)
    + [`.getTimecard(<timecard ID>)`](#-gettimecard--timecard-id---)
    + [`.getTimecardsForUser(<username>)`](#-gettimecardsforuser--username---)
    + [`.getTimecardsForEvent(<username>)`](#-gettimecardsforevent--username---)
    + [`.deleteTimecard(<timecard ID>)`](#-deletetimecard--timecard-id---)
    + [`.updateTimeIn(<timecard ID>, <new time in>)`](#-updatetimein--timecard-id----new-time-in---)
    + [`.updateTimeOut(<timecard ID>, <new time out>)`](#-updatetimeout--timecard-id----new-time-out---)
  * [userDataAccessor](#userdataaccessor)
    + [`new UserDataAccessor()`](#-new-userdataaccessor---)
    + [`.createUser(<username>, <first name>, <last name>, <permission level>, <gender>, <birthday>, <list of tags>, <password salt>, <password hash>)`](#-createuser--username----first-name----last-name----permission-level----gender----birthday----list-of-tags----password-salt----password-hash---)
    + [`.getUser(<username>)`](#-getuser--username---)
    + [`.getAllUsers()`](#-getallusers---)
    + [`.getAllChildren()`](#-getallchildren---)
    + [`.getAllStaff()`](#-getallstaff---)
    + [`.getAllChildrenAndStaff()`](#-getallchildrenandstaff---)
    + [`.getUserTags(<username>)`](#-getusertags--username---)
    + [`.getUserBirthday(<username>)`](#-getuserbirthday--username---)
    + [`.getUserGender(<username>)`](#-getusergender--username---)
    + [`.deleteUser(<username>)`](#-deleteuser--username---)
    + [`.updateFirstName(<username>, <new first name>)`](#-updatefirstname--username----new-first-name---)
    + [`.updateLastName(<username>, <new last name>)`](#-updatelastname--username----new-last-name---)
    + [`.updatePermission(<username>, <new permission level>)`](#-updatepermission--username----new-permission-level---)
    + [`.updateGender(<username>, <new gender>)`](#-updategender--username----new-gender---)
    + [`.updateBirthday(<username>, <new birthday>)`](#-updatebirthday--username----new-birthday---)
    + [`.addTag(<username>, <new tag>)`](#-addtag--username----new-tag---)
    + [`.removeTag(<username>, <tag to remove>)`](#-removetag--username----tag-to-remove---)
    + [`.updateTags(<username>, <new list of tags>)`](#-updatetags--username----new-list-of-tags---)
    + [`.updateSalt(<username>, <new password salt>)`](#-updatesalt--username----new-password-salt---)
    + [`.updateHash(<username>, <new password hash>)`](#-updatehash--username----new-password-hash---)
  * [usernameGenerator](#usernamegenerator)
    + [`generateUsername(<first name>, <last name>)`](#-generateusername--first-name----last-name---)

# CAHSM API Midend stuff

## What is this?

These are classes used to easily access stuff in the database via API calls. These classes will remove the need to call the API directly.

The API must be running at the time to use.

# Testing

Go in the midend/test directory and npm install [whatever is needed]

Then, `node test_<file_to_test>.js`

This should show all of the capabilities available for accessing the API

## Test Output

Output should look something like:
```
Clocked-in:
{"id":"4512970907","userName":"bobsmith","eventId":"someEventId","timeIn":"1614197828561","timeOut":"-1"}
Found timecard:
{"id":"4512970907","userName":"bobsmith","eventId":"someEventId","timeIn":"1614197828561","timeOut":"-1"}
Found timecard(s) for user:
[{"id":"4512970907","userName":"bobsmith","eventId":"someEventId","timeIn":"1614197828561","timeOut":"-1"}]
Found timecard(s) for event:
[{"id":"4512970907","userName":"bobsmith","eventId":"someEventId","timeIn":"1614197828561","timeOut":"-1"}]
Clocked-out:
{"id":"4512970907","userName":"bobsmith","eventId":"someEventId","timeIn":"1614197828561","timeOut":"1614197831873"}
Deleted timecard id: 4512970907
```

# Files and their functions

## baseUrl

File containing the url for the API. This is used to reference in other files.

## clockInPageHelper

Class for generating what is displayed on the checkInOut page 

### `new ClockInPageHelper(<user_name>)`

Constructor for class

Calculates a sorted list of events in chronological order for a user

### `.getPreviousEvent()` 

Gets the previous event that the user was scheduled for (if there is one)

Returns an event object or null

### `.getCurrentEvent()`

Gets the currently ongoing or next event that a user is scheduled for (if there is one)

Returns an event object or null

### `.getNextEvent()`

Gets the next event in the future after the current event (if there is one)

Returns an event object or null

### `.getAll()`

Gets the previous, current, and next event that the user is scheduled for (if there are any)

Returns an object containing the three different objects

Format:
```
{
    previousEvent: {previous event object},
    currentEvent: {current event object},
    nextEvent: {next event object}
}
```

## eventDataAccessor

### `new EventDataAccessor()`

Creates an eventDataAccessor object for use

### `.createEvent(<event name>, <description>, <category>, <start time (YYYY-MM-DD hh:ss)>, <end time (YYYY-MM-DD hh:ss)>, <location>)`

Creates an event with the inputted information as its attributes.

Automatically generates an ID.

Returns the API response for the POST request upon creation. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getEvent(<event ID>)`

Gets an event with the provided event ID.

Returns the full GET API response. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getAllEvents()`

Gets all events in the database.

Returns the full GET API response. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateEventName(<event ID>, <new event name>)`

Updates the name of the event with the provided ID.

Returns the full PATCH API response. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateDescription(<event ID>, <new description>)`

Updates the description of the event with the provided ID.

Returns the full PATCH API response. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateCategory(<event ID>, <new category>)`

Updates the category of the event with the provided ID.

Returns the full PATCH API response. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateStartTime(<event ID>, <new start time>)`

Updates the start time of the event with the provided ID.

Returns the full PATCH API response. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateEndTime(<event ID>, <new end time>)`

Updates the end time of the event with the provided ID.

Returns the full PATCH API response. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateLocation(<event ID>, <new location>)`

Updates the location of the event with the provided ID.

Returns the full PATCH API response. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.deleteEvent(<event ID>)`

Deletes the event with the provide ID.

## logGenerator

Class for generating what is displayed on the child's log page

Sorts a user's timecards for display.

### `new LogGenerator(<user name>)`

Constructor for class which sorts all of the user's timecards into a list.

### `.getLog()`

Returns a list of objects containing the full log for a user.

Format for object in list:
```
{
    event: <event name>,
    timecardId: <timecard id>,
    clockIn: <clock in time>,
    clockOut: <clock out time>
}
```

## logIn

File with function to check if the password for a user is correct

### `isPasswordCorrect(<user name>, <inputted password>)`

Checks the password for the specified user.

If the password is correct, `True` is returned; otherwise, `False` is returned.

## passwordGeneration

Functions for hashing and generating passwords

### `hashPassword(<password>)`

Hashes the inputted password and returns the salt and the hash for the password.

Output format:
```
{
    salt:<salt>,
    hash:<value>
}
```

### `generatePassword(<optional length (auto-set to 10)>)`

Generates a password with random alphanumeric characters with a specified length.

Length is automatically set to 10, but can be changed.

Password example: `POPe4aibZN`

## permissionCheck

### `checkForPermission(<username>, <permission>)`

Checks if the specified user has the specified permission level or higher.

Returns `True` if they do, `False` if they don't

### `getUserPermission(<username>)`

Gets the specified user's value for their stored permission.

Returns a string permission (child, lowStaff, upStaff, or sysOverseer)

## scheduleDataAccessor

Class for creating, viewing, updating, and deleting schedules

### `new ScheduleDataAccessor()`

Constructor

Returns ScheduleDataAccessor object

### `.createSchedule(<username>, <events (list of event IDs)>)`

Creates a schedule for the specified user with the specified list of event IDs.

Returns the API response for the POST request upon creation. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getSchedule(<username>)`

Gets the schedule for the specified user

Returns the API response for the GET request upon creation. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getEvents(<username>)`

Gets the list of event IDs that a user is scheduled for.

Returns a list of strings, which are the IDs of the events that the user is schedule for.

### `.addEvent(<username>, <new event ID>)`

Adds an event to the specified user's schedule.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.removeEvent(<username>, <event ID to remove>)`

Removes an event from the specified user's schedule if it is on the schedule.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.overwriteEvents(<username>, <new list of event IDs>)`

Replaces the specified user's list of event IDs on their schedule with the provided list of event IDs.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

## timecardDataAccessor

Class for creating, viewing, updating, and deleting timecards

### `new TimecardDataAccessor()`

Constructor

Returns TimecardDataAccessor object

### `.generateID()`

Generates a 10-digit long integer ID converted to a string.

Keeps trying until a timecard doesn't exist with that ID

Returns a 10-digit long string ID. Example: `0982374549`

### `.clockIn(<username>, <event ID>, <time in>)`

Clocks a user into the specified event at the specified time.

Creates a new timecard with this information:

```
{
    "id": this.generateID(),
    "userName": <username>.toLowerCase(),
    "eventId": <event ID>,
    "timeIn": <time in>,
    "timeOut": "-1"
}
```

Sets the `timeOut` attribute to `-1` in order to distinguish it between a timecard that has been clocked out.

Returns the API response for the POST request upon creation. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.clockOut(<time out>, <timecard ID>)`

Clocks the specified timecard out at the specified time.

Replaces the stored `timeOut` with the inputted time out.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getTimecard(<timecard ID>)`

Gets the timecard with the specified ID.

Returns the API response for the GET request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getTimecardsForUser(<username>)`

Gets all of the timecards for the specified user. Returned in a list format within the GET request.

Returns the API response for the GET request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getTimecardsForEvent(<username>)`

Gets all of the timecards for the specified event. Returned in a list format within the GET request.

Returns the API response for the GET request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.deleteTimecard(<timecard ID>)`

Deletes the timecard with the specified ID.

### `.updateTimeIn(<timecard ID>, <new time in>)`

Updates the clock-in time for a specified timecard.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateTimeOut(<timecard ID>, <new time out>)`

Updates the clock-out time for a specified timecard.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

## userDataAccessor

Class for creating, viewing, updating, and deleting users

### `new UserDataAccessor()`

Constructor

Returns UserDataAccessor object

### `.createUser(<username>, <first name>, <last name>, <permission level>, <gender>, <birthday>, <list of tags>, <password salt>, <password hash>)`

Creates a new user with this information:
```
{
    "userName": <username>,
    "fName": <first name>,
    "lName": <last name>,
    "permission": <permission level>,
    "gender": <gender>,
    "birthday": <birthday>,
    "tags": [
        <list,
        of,
        tags>
    ],
    "salt": <password salt>,
    "hash": <password hash>
}
```

Returns the API response for the POST request upon creation. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getUser(<username>)`

Gets the user with the specified username.

Returns the API response for the GET request upon creation. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getAllUsers()`

Gets all user objects stored in the database in list format within the API response.

Returns the API response for the GET request upon creation. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getAllChildren()`

Gets a list of all users that are children.

Returns the API response for the GET request upon creation. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getAllStaff()`

Gets a list of all users that are staff (lower staff, upper staff, and overseers).

Returns the API response for the GET request upon creation. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.getAllChildrenAndStaff()`

Gets all children and staff in two separate lists.

Return format:
```
{
    children: [
        {list},
        {of},
        {children},
        {objects}
    ],
    staff: [
        {list},
        {of},
        {staff},
        {objects}
    ]
}
```

### `.getUserTags(<username>)`

Get the list of tags for a specified user.

Returns a list of `String` tags.

### `.getUserBirthday(<username>)`

Get the birthday of a specified user.

Returns the `String` birthday of a user.

### `.getUserGender(<username>)`

Get the gender of a specified user.

Returns a `String` gender of a user.

### `.deleteUser(<username>)`

Deletes a user with the specified username.

### `.updateFirstName(<username>, <new first name>)`

Updates the first name of the specified username.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateLastName(<username>, <new last name>)`

Updates the last name of the specified username.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updatePermission(<username>, <new permission level>)`

Updates the permission level of the specified username.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateGender(<username>, <new gender>)`

Updates the gender of the specified username.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateBirthday(<username>, <new birthday>)`

Updates the birthday of the specified username.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.addTag(<username>, <new tag>)`

Adds a tag to the specified user's list of tags.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.removeTag(<username>, <tag to remove>)`

Removes a tag from the specified user's list of tags if it exists in their list of tags.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateTags(<username>, <new list of tags>)`

Replaces the specified user's list of tags with the inputted list of tags.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateSalt(<username>, <new password salt>)`

Updates the password salt of the specified username.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

### `.updateHash(<username>, <new password hash>)`

Updates the password hash of the specified username.

Returns the API response for the PATCH request. Use `JSON.parse()` to parse the response. Add `.data` at the end of the parsed response to get the full event object.

## usernameGenerator

Contains a function to generate a username.

### `generateUsername(<first name>, <last name>)`

Generate a username based on the inputted first name and last name.

Format: <last name><first initial><up to 3 integers>
Example: rodgersa420

Returns the generated username.