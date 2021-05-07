from flask import Flask, g
from flask_restful import Resource, Api, reqparse
import os
import markdown
import shelve
from .appInit import app

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = shelve.open("users.db")
    return db

@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route("/")
def index():
    """Present some documentation"""

    # Open the README file
    with open (os.path.dirname(app.root_path) + '/README.md', 'r') as markdown_file:

        #Read the contents of the file
        content = markdown_file.read()

        # Convert to HTML
        return markdown.markdown(content)

class UserList(Resource):
    def get(self):
        shelf = get_db()
        keys = list(shelf.keys())

        users = []

        for key in keys:
            users.append(shelf[key])

        return {'message': 'Success', 'data': users}, 200

    def post(self):
        parser = reqparse.RequestParser()

        parser.add_argument('userName', required=True)
        parser.add_argument('fName', required=True)
        parser.add_argument('lName', required=True)
        parser.add_argument('salt', required=True)
        parser.add_argument('hash', required=True)
        parser.add_argument('permission', required=True)
        parser.add_argument('gender', required=True)
        parser.add_argument('birthday', required=True)
        parser.add_argument('tags', type=str, action='append', required=False)

        # Parse the arguments into an object
        args = parser.parse_args()
        args['userName'] = args['userName'].lower()

        shelf = get_db()
        shelf[args['userName']] = args

        return {'message': 'User registered', 'data': args}, 201

class User(Resource):
    def get(self, userName):
        userName = userName.lower()
        shelf = get_db()

        # If the key does not exist in the data store, return a 404 error
        if not (userName in shelf):
            return {'message': 'User not found', 'data':{}}, 404

        return {'message': 'User found', 'data': shelf[userName]}, 200

    def delete(self, userName):
        userName = userName.lower()
        shelf = get_db()

        # If the key does not exist in the data store, return a 404 error
        if not (userName in shelf):
            return {'message': 'User not found', 'data':{}}, 404

        del shelf[userName]
        return '', 204

    def patch(self, userName):
        userName = userName.lower()
        shelf = get_db()
        if not (userName in shelf):
            return {'message': 'User not found', 'data':{}}, 404

        parser = reqparse.RequestParser()

        parser.add_argument('userName', required=False)
        parser.add_argument('fName', required=False)
        parser.add_argument('lName', required=False)
        parser.add_argument('salt', required=False)
        parser.add_argument('hash', required=False)
        parser.add_argument('permission', required=False)
        parser.add_argument('gender', required=False)
        parser.add_argument('birthday', required=False)
        parser.add_argument('tags', type=str, action='append', required=False)

        args = parser.parse_args()
        updated_args = shelf[userName]

        for key in list(args.keys()):
            if args[key] != None:
                updated_args[key] = args[key]

        shelf[userName] = updated_args

        return {'message': 'Successfully put data', 'data': shelf[userName]}, 200
