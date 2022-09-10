"""Import flask"""
from flask import Flask

APP = Flask(__name__)

@APP.route("/")
def hello_world():
    """Hello world function"""
    return "<p>Hello, World!</p>"
