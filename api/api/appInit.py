from flask import Flask
from flask_restful import Api

# Create the instance of Flask
app = Flask(__name__)

# Create the API
api = Api(app)