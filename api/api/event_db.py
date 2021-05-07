from flask import Flask, g
from flask_restful import Resource, Api, reqparse
import os
import markdown
import shelve
from .appInit import app

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = shelve.open("events.db")
    return db

@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

class EventList(Resource):
    def get(self):
        shelf = get_db()
        keys = list(shelf.keys())

        events = []

        for key in keys:
            events.append(shelf[key])

        return {'message': 'Success', 'data': events}, 200
    
    #adding new information for event
    def post(self):
        parser = reqparse.RequestParser()

        parser.add_argument('id', required=True)
        parser.add_argument('name', required=True)
        parser.add_argument('description', required=True)
        parser.add_argument('category', required=False)
        parser.add_argument('startTime', required=True)
        parser.add_argument('endTime', required=True)
        parser.add_argument('location', required=False)

        # Parse the arguments into an object
        args = parser.parse_args()

        shelf = get_db()
        shelf[args['id']] = args

        return {'message': 'Event created', 'data': args}, 201

class Event(Resource):
    def get(self, eventId):
        shelf = get_db()

        # If the key does not exist in the data store, return a 404 error
        if not (eventId in shelf):
            return {'message': 'Event not found', 'data':{}}, 404

        return {'message': 'Event found', 'data': shelf[eventId]}, 200

    def delete(self, eventId):
        shelf = get_db()

        # If the key does not exist in the data store, return a 404 error
        if not (eventId in shelf):
            return {'message': 'Event not found', 'data':{}}, 404

        del shelf[eventId]
        return '', 204

    def patch(self, eventId):
        shelf = get_db()
        if not (eventId in shelf):
            return {'message': 'Event not found', 'data':{}}, 404

        parser = reqparse.RequestParser()

        parser.add_argument('name', required=False)
        parser.add_argument('description', required=False)
        parser.add_argument('category', required=False)
        parser.add_argument('startTime', required=False)
        parser.add_argument('endTime', required=False)
        parser.add_argument('location', required=False)

        args = parser.parse_args()
        updated_args = shelf[eventId]

        for key in list(args.keys()):
            if args[key] != None:
                updated_args[key] = args[key]

        shelf[eventId] = updated_args

        return {'message': 'Successfully put data', 'data': shelf[eventId]}, 200

