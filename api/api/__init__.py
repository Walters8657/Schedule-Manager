from flask import Flask
from flask_restful import Resource, Api
from .user_db import User, UserList
from .event_db import Event, EventList
from .schedule_db import Schedule, ScheduleList
from .timecard_db import Timecard, TimecardList, TimecardUser, TimecardEvent
from .appInit import api

# User
api.add_resource(UserList, '/users')
api.add_resource(User, '/user/<string:userName>')

# Event
api.add_resource(EventList, '/events')
api.add_resource(Event, '/event/<string:eventId>')

# Schedule
api.add_resource(ScheduleList, '/schedules')
api.add_resource(Schedule, '/schedule/<string:userName>')

# Timecard
api.add_resource(TimecardList, '/timecards')
api.add_resource(Timecard, '/timecard/<string:timecardId>')
api.add_resource(TimecardUser, '/timecards/users/<string:userName>')
api.add_resource(TimecardEvent, '/timecards/events/<string:eventId>')