"""User routes (get, post, etc.)"""
from queue import Empty
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify, request
from flask.blueprints import Blueprint
import service.user as user_service
from middleware.token_required import token_required
from model.user import User

user_api = Blueprint('user_api', __name__)

def check_permission(current_user: User):
    """Checks if the current user is authorized"""
    if current_user=={}:
            raise PermissionError("Could not verify user")
        
@user_api.route('/user', methods = ['GET'])
@token_required
def get_users(current_user:User):
    """Get all requested users

    If id is provided then then only the user with that id is returned
    If a username is provided then only the user with that username is returned
    If nothing is provided then all the users are returned
    """
    try:
        check_permission(current_user)
        
        if 'id' in request.json:
            user = user_service.get_by_id(request.json['id'])
        elif 'username' in request.json:
            user = user_service.get_by_username(request.json['username'])
        else:
            users = user_service.get_users()
            return jsonify([i.serialize for i in users])
        
        return user.serialize
    except PermissionError as err:
        return {"error":str(err)}, 401
    except Exception as err:
        return {"error":str(err)}, 400
    
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
    
@user_api.route('/user', methods=['PUT'])
@token_required
# @admin_required
def add_category(current_user:User):
    try:
        check_permission(current_user)
        if not request.json:
            raise ValueError("No data was provided")
        
        trainer_id = request.json['trainer_id']
        # category_id = request.json['category_id']
        
        trainer = user_service.get_by_id(trainer_id)
        # category = category_service.get_by_id(category_id)
        # user_service.add_category(trainer, category)
        
    except PermissionError as err:
        return {"error":str(err)}, 401
    except Exception as err:
        return {"error":str(err)}, 400

@user_api.route('/user', methods=['DELETE'])
@token_required
# @admin_required
def remove_category(current_user:User):
    try:
        check_permission(current_user)
        if not request.json:
            raise ValueError("No data was provided")
        
        trainer_id = request.json['trainer_id']
        # category_id = request.json['category_id']
        
        trainer = user_service.get_by_id(trainer_id)
        # category = category_service.get_by_id(category_id)
        # user_service.remove_category(trainer, category)
        
    except PermissionError as err:
        return {"error":str(err)}, 401
    except Exception as err:
        return {"error":str(err)}, 400