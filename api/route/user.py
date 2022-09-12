"""User routes (get, post, etc.)"""
from flask import jsonify, request
from flask.blueprints import Blueprint
import service.user as user_service

user_api = Blueprint('user_api', __name__)

@user_api.route('/user', methods = ['GET'])
def get_users() -> str:
    """Get all users

    Returns all the users in the database
    """

    users = user_service.get_users()
    return jsonify([i.serialize for i in users])


@user_api.route('/user', methods=['POST'])
def add_user():
    """Add a new user

    Takes a username and a password and returns the new user ID.
    If the username already exists the user is not added.
    """

    username = request.form.get('username')
    password = request.form.get('password')
    user_response = user_service.create_user(username=username, password=password)
    if "error" in user_response:
        return user_response, 409
    return user_response
