from flask import Flask, g
from flask_restful import Resource, Api, reqparse
import os
import markdown
import shelve
from .appInit import app

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = shelve.open("timecards.db")
    return db

@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

class TimecardList(Resource):
    def get(self):
        shelf = get_db()
        keys = list(shelf.keys())

        timecards = []

        for key in keys:
            timecards.append(shelf[key])

        return {'message': 'Success', 'data': timecards}, 200

    def post(self):
        parser = reqparse.RequestParser()

        parser.add_argument('id', required=True)
        parser.add_argument('userName', required=True)
        parser.add_argument('eventId', required=True)
        parser.add_argument('timeIn', required=True)
        parser.add_argument('timeOut', required=False)

        # Parse the arguments into an object
        args = parser.parse_args()

        shelf = get_db()
        shelf[args['id']] = args

        return {'message': 'Timecard created', 'data': args}, 201

class Timecard(Resource):
    def get(self, timecardId):
        shelf = get_db()

        # If the key does not exist in the data store, return a 404 error
        if not (timecardId in shelf):
            return {'message': 'Timecard not found', 'data':{}}, 404

        return {'message': 'Timecard found', 'data': shelf[timecardId]}, 200

    def delete(self, timecardId):
        shelf = get_db()

        # If the key does not exist in the data store, return a 404 error
        if not (timecardId in shelf):
            return {'message': 'Timecard not found', 'data':{}}, 404

        del shelf[timecardId]
        return '', 204

    def patch(self, timecardId):
        shelf = get_db()
        if not (timecardId in shelf):
            return {'message': 'Timecard not found', 'data':{}}, 404

        parser = reqparse.RequestParser()

        parser.add_argument('id', required=False)
        parser.add_argument('userName', required=False)
        parser.add_argument('eventId', required=False)
        parser.add_argument('timeIn', required=False)
        parser.add_argument('timeOut', required=False)

        args = parser.parse_args()
        updated_args = shelf[timecardId]

        for key in list(args.keys()):
            if args[key] != None:
                updated_args[key] = args[key]

        shelf[timecardId] = updated_args

        return {'message': 'Successfully put data', 'data': shelf[timecardId]}, 200

class TimecardUser(Resource):
    def get(self, userName):
        shelf = get_db()
        keys = list(shelf.keys())

        timecards = []

        for key in keys:
            if dict(shelf[key])['userName'] == userName:
                timecards.append(shelf[key])

        if len(timecards) < 1:
            return {'message': 'Timecard not found', 'data':{}}, 404

        return {'message': 'Success', 'data': timecards}, 200

class TimecardEvent(Resource):
    def get(self, eventId):
        shelf = get_db()
        keys = list(shelf.keys())

        timecards = []

        for key in keys:
            if dict(shelf[key])['eventId'] == eventId:
                timecards.append(shelf[key])

        if len(timecards) < 1:
            return {'message': 'Timecard not found', 'data':{}}, 404

        return {'message': 'Success', 'data': timecards}, 200