from flask import Flask, g
from flask_restful import Resource, Api, reqparse
import os
import markdown
import shelve
from .appInit import app

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = shelve.open("schedules.db")
    return db

@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

class ScheduleList(Resource):
    def get(self):
        shelf = get_db()
        keys = list(shelf.keys())

        schedules = []

        for key in keys:
            schedules.append(shelf[key])

        return {'message': 'Success', 'data': schedules}, 200

    def post(self):
        parser = reqparse.RequestParser()

        parser.add_argument('userName', required=True)
        parser.add_argument('events', type=str, action='append', required=False)

        # Parse the arguments into an object
        args = parser.parse_args()

        shelf = get_db()
        args['userName'] = args['userName'].lower()
        shelf[args['userName']] = args

        return {'message': 'Schedule registered', 'data': args}, 201

class Schedule(Resource):
    def get(self, userName):
        shelf = get_db()
        userName = userName.lower()

        # If the key does not exist in the data store, return a 404 error
        if not (userName in shelf):
            return {'message': 'User schedule not found', 'data':{}}, 404

        return {'message': 'User schedule found', 'data': shelf[userName]}, 200

    def delete(self, userName):
        shelf = get_db()
        userName = userName.lower()

        # If the key does not exist in the data store, return a 404 error
        if not (userName in shelf):
            return {'message': 'User schedule not found', 'data':{}}, 404

        del shelf[userName]
        return '', 204

    def patch(self, userName):
        shelf = get_db()
        userName = userName.lower()

        if not (userName in shelf):
            return {'message': 'User schedule not found', 'data':{}}, 404

        parser = reqparse.RequestParser()

        parser.add_argument('userName', required=False)
        parser.add_argument('events', type=str, action='append', required=False)

        args = parser.parse_args()
        updated_args = shelf[userName]

        for key in list(args.keys()):
            if args[key] != None:
                updated_args[key] = args[key]

        shelf[userName] = updated_args

        return {'message': 'Successfully patched data', 'data': shelf[userName]}, 200