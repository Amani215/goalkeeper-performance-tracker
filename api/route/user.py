"""User routes (get, post, etc.)"""
from flask import jsonify, request
from flask.blueprints import Blueprint
import service.user as user_service
from middleware.token_required import token_required
from model.user import User

user_api = Blueprint('user_api', __name__)

@user_api.route('/user', methods = ['GET'])
@token_required
def get_users(current_user:User):
    """Get all users

    Returns all the users in the database
    """
    if current_user=={}:
        return {"error":"Could not verify user"}, 401
    users = user_service.get_users()
    return jsonify([i.serialize for i in users])


@user_api.route('/user', methods=['POST'])
def add_user():
    """Add a new user

    Takes a username and a password and returns the new user ID.
    If the username already exists the user is not added.
    """
    try:
        if not request.json:
            raise ValueError("No data was provided")
        
        username = request.json['username']
        password = request.json['password']
        user_response = user_service.add_user(username=username, password=password)
        return user_response
    except Exception as err:
        return {"error":str(err)}, 400
    
