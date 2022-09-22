"""Authentication and Authorization routes"""
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.user import User
from middleware.token_required import token_required
import service.auth as auth_service

auth_api = Blueprint('auth_api', __name__)

@auth_api.route('/auth', methods=['POST'])
def authenticate():
    """Authenticate the user

    Returns a json web token if the user is authenticated successfully
    """
    try:
        if not request.json:
            raise ValueError("No data was provided")
        
        username = request.json['username']
        password = request.json['password']
        return jsonify(auth_service.authenticate_user(username=username, password=password))
    except PermissionError as err:
        return {"error":str(err)}, 401
    except Exception as err:
        return {"error":str(err)}, 400

@auth_api.route('/auth', methods=['GET'])
@token_required
def get_authenticated_user(user: User):
    """Get the current authenticated user

    Returns the user object without the pasword according to the JWT
    """
    return jsonify(user.serialize)
