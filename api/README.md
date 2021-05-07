- [CAHSM API Service](#cahsm-api-service)
  * [TABLE FORMATS (JSON FORMAT)](#table-formats--json-format-)
    + [User](#user)
    + [Event](#event)
    + [Schedule](#schedule)
    + [Timecards](#timecards)
  * [API Usage](#api-usage)
    + [List all users](#list-all-users)
    + [Display specific user information](#display-specific-user-information)
    + [Register a new user](#register-a-new-user)
    + [Update a user](#update-a-user)
    + [Delete a user](#delete-a-user)
    + [List all events](#list-all-events)
    + [Display specific event information](#display-specific-event-information)
    + [Creating a new event](#creating-a-new-event)
    + [Update an event](#update-an-event)
    + [Delete an event](#delete-an-event)
    + [List all schedules](#list-all-schedules)
    + [Display specific schedule information](#display-specific-schedule-information)
    + [Create a new schedule](#create-a-new-schedule)
    + [Update a schedule](#update-a-schedule)
    + [Delete a schedule](#delete-a-schedule)
    + [List all timecards](#list-all-timecards)
    + [Display specific timecard information](#display-specific-timecard-information)
    + [Display specific timecard information for a user](#display-specific-timecard-information-for-a-user)
    + [Display specific timecard information for an event](#display-specific-timecard-information-for-an-event)
    + [Creating a new timecard](#creating-a-new-timecard)
    + [Update a timecard](#update-a-timecard)
    + [Delete a timecard](#delete-a-timecard)

# CAHSM API Service

## TABLE FORMATS (JSON FORMAT)

### User

```json
{
    "userName": "someUserName",
    "fName": "john",
    "lName": "smith",
    "permission": "permission",
    "gender": "m",
    "birthday": "01/01/1900",
    "tags":[
        "papajohns",
        "9th grader"
    ],
    "salt": "someSalt",
    "hash": "someHash"
}
```

### Event

```json
{
    "id": "someId",
    "name": "someName",
    "description": "someDescription",
    "category": "someCategory",
    "startTime": "someTime",
    "endTime": "someTime",
    "location": "someLocation"
}
```

### Schedule

```json
{
    "userName": "someUserName",
    "events": [
        "someEventId",
        "someOtherEventId"
    ]
}
```

### Timecards

```json
{
    "id": "someId",
    "userName": "someUserName",
    "eventId": "someEventId",
    "timeIn": "someTimeIn",
    "timeOut": "someTimeOut"
}
```

## API Usage

All responses will have the form

```json
{
    "data": "Mixed type holding the content of the response",
    "message": "Description of what happened"
}
```

Subsequent response definitions will only detail the expected value of the `data field`

### List all users

**Definition**

`GET /users`

**Response**

- `200 OK` on success

```json
[
    {
        "userName": "someUserName",
        "fName": "john",
        "lName": "smith",
        "permission": "permission",
        "gender": "m",
        "birthday": "01/01/1900",
        "tags":[
            "papajohns",
            "9th grader"
        ],
        "salt": "someSalt",
        "hash": "someHash"
    },
    {
        "userName": "someUserName",
        "fName": "ronald",
        "lName": "mackey",
        "permission": "permission",
        "gender": "m",
        "birthday": "01/01/1900",
        "tags":[
            "papajohns",
            "9th grader"
        ],
        "salt": "someSalt",
        "hash": "someHash"
    }
]
```

### Display specific user information

**Definition**

`GET /users/<userName>`

**Response**

- `200 OK` on success
- `404 Not Found` if the user does not exist

```json
{
    "userName": "someUserName",
    "fName": "john",
    "lName": "smith",
    "permission": "permission",
    "gender": "m",
    "birthday": "01/01/1900",
    "tags":[
        "papajohns",
        "9th grader"
    ],
    "salt": "someSalt",
    "hash": "someHash"
}
```

### Register a new user

**Definition**

`POST /users`

**Arguments**

- `"userName":string` the username of the new user
- `"fName":string` the first name of the new user
- `"lName":string` the last name of the new user
- `"salt":string` salt for the password
- `"hash":string` hash for the password
- `"permissions":string` list of string permissions associated with the user
- `"tags":string` list of tags associated with a user

If a user with the given userName already exists, the existing user will be overwritten.

**Response**

- `201 Created` on success

```json
{
    "userName": "someUserName",
    "fName": "john",
    "lName": "smith",
    "permission": "permission",
    "gender": "m",
    "birthday": "01/01/1900",
    "tags":[
        "papajohns",
        "9th grader"
    ],
    "salt": "someSalt",
    "hash": "someHash"
}
```

### Update a user

**Definition**

`PATCH /user/<userName>`

**Possible Arguments**

Not all arguments are necessary - only the ones that need updating

- `"userName":string` the username of the new user
- `"fName":string` the first name of the new user
- `"lName":string` the last name of the new user
- `"salt":string` salt for the password
- `"hash":string` hash for the password
- `"permissions":string` list of permissions associated with the user
- `"tags":string` list of tags associated with a user

**Response**

- `200 Patched` on success
- `404 Not Found` if the user does not exist

```json
{
    "userName": "someUserName",
    "fName": "jeff",
    "lName": "smith",
    "permission": "permission",
    "gender": "m",
    "birthday": "01/01/1900",
    "tags":[
        "papajohns",
        "9th grader"
    ],
    "salt": "someSalt",
    "hash": "someHash"
}
```

### Delete a user

**Definition**

`DELETE /user/<userName>`

**Response**

- `404 Not Found` if the user does not exist
- `204 No Content` on success

### List all events

**Definition**

`GET /events`

**Response**

- `200 OK` on success

```json
[
    {
        "id": "someId",
        "name": "someName",
        "description": "someDescription",
        "category": "someCategory",
        "time": "someTime",
        "location": "someLocation"
    },
    {
        "id": "someOtherId",
        "name": "someOtherrName",
        "description": "someDescription",
        "category": "someOtherCategory",
        "time": "someOtherTime",
        "location": "someOtherLocation"
    }
]
```

### Display specific event information

**Definition**

`GET /events/<eventID>`

**Response**

- `200 OK` on success
- `404 Not Found` if the event does not exist

```json
{
    "id": "someId",
    "name": "someName",
    "description": "someDescription",
    "category": "someCategory",
    "time": "someTime",
    "location": "someLocation"
}
```

### Creating a new event

**Definition**

`POST /events`

**Arguments**

- `"id":string` the identifier for the event
- `"name":string` the name of the event
- `"description":string` the description of the event
- `"category":string` the category of the event
- `"time":string` the time the event takes place
- `"location":string` the location of the event

If a user with the given identifier already exists, the existing event will be overwritten.

**Response**

- `201 Created` on success

```json
{
    "id": "someId",
    "name": "someName",
    "description": "someDescription",
    "category": "someCategory",
    "time": "someTime",
    "location": "someLocation"
}
```

### Update an event

**Definition**

`PATCH /event/<eventId>`

**Possible Arguments**

Not all arguments are necessary - only the ones that need updating

- `"id":string` the identifier for the event
- `"name":string` the name of the event
- `"description":string` the description of the event
- `"category":string` the category of the event
- `"time":string` the time the event takes place
- `"location":string` the location of the event

**Response**

- `200 Patched` on success
- `404 Not Found` if the event does not exist

```json
{
    "id": "someId",
    "name": "someName",
    "description": "someDescription",
    "category": "someCategory",
    "time": "someTime",
    "location": "someLocation"
}
```

### Delete an event

**Definition**

`DELETE /event/<eventID>`

**Response**

- `404 Not Found` if the event does not exist
- `204 No Content` on success

### List all schedules

**Definition**

`GET /schedules`

**Response**

- `200 OK` on success

```json
[
    {
        "userName": "someUserName",
        "events": [
            "someEventId",
            "someOtherEventId"
        ]
    },
    {
        "userName": "someOtherUserName",
        "events": [
            "someEventId",
            "someOtherEventId"
        ]
    }
]
```

### Display specific schedule information

**Definition**

`GET /schedule/<userName>`

**Response**

- `200 OK` on success
- `404 Not Found` if the user's schedule does not exist

```json
{
    "userName": "someUserName",
    "events": [
        "someEventId",
        "someOtherEventId"
    ]
}
```

### Create a new schedule

**Definition**

`POST /schedules`

**Arguments**

- `"userName":string` the user who the schedule belongs to
- `"events":list<string>` the events the user is assigned to

If a schedule with the given userName already exists, the existing schedule will be overwritten.

**Response**

- `201 Created` on success

```json
{
    "user": "someUserName",
    "events": [
        "someEventId",
        "someOtherEventId"
    ]
}
```

### Update a schedule

**Definition**

`PATCH /schedule/<userName>`

**Possible Arguments**

Not all arguments are necessary - only the ones that need updating

- `"userName":string` the user who the schedule belongs to
- `"events":list<string>` the events the user is assigned to

**Response**

- `200 Patched` on success
- `404 Not Found` if the event does not exist

```json
{
    "userName": "someUserName",
    "events": [
        "someEventId",
        "someOtherEventId"
    ]
}
```

### Delete a schedule

**Definition**

`DELETE /schedule/<userName>`

**Response**

- `404 Not Found` if the schedule does not exist
- `204 No Content` on success

### List all timecards

**Definition**

`GET /timecards`

**Response**

- `200 OK` on success

```json
[
    {
        "id": "someId",
        "userName": "someUserName",
        "eventId": "someEventId",
        "timeIn": "someTimeIn",
        "timeOut": "someTimeOut"
    },
    {
        "id": "someOtherId",
        "userName": "someOtherUserName",
        "eventId": "someOtherEventId",
        "timeIn": "someOtherTimeIn",
        "timeOut": "someOtherTimeOut"
    }
]
```

### Display specific timecard information

**Definition**

`GET /timecard/<timeCardId>`

**Response**

- `200 OK` on success
- `404 Not Found` if the specified timecard does not exist

```json
{
    "id": "someId",
    "userName": "someUserName",
    "eventId": "someEventId",
    "timeIn": "someTimeIn",
    "timeOut": "someTimeOut"
}
```

### Display specific timecard information for a user

**Definition**

`GET /timecards/users/<userId>`

**Response**

- `200 OK` on success
- `404 Not Found` if a timecard for the user does not exist

```json
[
    {
        "id": "someId",
        "userName": "someUserName",
        "eventId": "someEventId",
        "timeIn": "someTimeIn",
        "timeOut": "someTimeOut"
    },
    {
        "id": "someOtherId",
        "userName": "someUserName",
        "eventId": "someOtherEventId",
        "timeIn": "someOtherTimeIn",
        "timeOut": "someOtherTimeOut"
    }
]
```

### Display specific timecard information for an event

**Definition**

`GET /timecards/events/<eventId>`

**Response**

- `200 OK` on success
- `404 Not Found` if a timecard for the event does not exist

```json
[
    {
        "id": "someId",
        "userName": "someUserName",
        "eventId": "someEventId",
        "timeIn": "someTimeIn",
        "timeOut": "someTimeOut"
    },
    {
        "id": "someOtherId",
        "userName": "someOtherUserName",
        "eventId": "someEventId",
        "timeIn": "someOtherTimeIn",
        "timeOut": "someOtherTimeOut"
    }
]
```

### Creating a new timecard

**Definition**

`POST /timecards`

**Arguments**

- `"id":string` the unique identifier for the timecard
- `"userName":string` the user who the timecard belongs to
- `"eventId":list<string>` the event the timecard is associated with
- `"timeIn":list<string>` the time the user clocked into the event
- `"timeOut":list<string>` the time the user clocked out of the event

If a timecard with the given identifier already exists, the existing timecard will be overwritten.

**Response**

- `201 Created` on success

```json
{
    "id": "someId",
    "userName": "someUserName",
    "eventId": "someEventId",
    "timeIn": "someTimeIn",
    "timeOut": "someTimeOut"
}
```

### Update a timecard

**Definition**

`PATCH /timecard/<timecardId>`

**Possible Arguments**

Not all arguments are necessary - only the ones that need updating

- `"id":string` the unique identifier for the timecard
- `"userName":string` the user who the timecard belongs to
- `"eventId":list<string>` the event the timecard is associated with
- `"timeIn":list<string>` the time the user clocked into the event
- `"timeOut":list<string>` the time the user clocked out of the event

**Response**

- `200 Patched` on success
- `404 Not Found` if the timecard does not exist

```json
{
    "id": "someId",
    "userName": "someUserName",
    "eventId": "someEventId",
    "timeIn": "someTimeIn",
    "timeOut": "someTimeOut"
}
```

### Delete a timecard

**Definition**

`DELETE /timecard/<timecardId>`

**Response**

- `404 Not Found` if the timecard does not exist
- `204 No Content` on success
