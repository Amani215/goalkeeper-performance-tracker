"""Authentication and Authorization routes"""
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.user import User
from middleware.token_required import token_required
import service.redis as redis_service

redis_api = Blueprint('redis_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'

@redis_api.route('/redis', methods=['POST'])
@token_required(admin=True)
def add_item(current_user: User):
    """
    """
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)
    
    except PermissionError as err:
        return {"error":str(err)}, 401
    except Exception as err:
        return {"error":str(err)}, 400

@redis_api.route('/redis', methods=['GET'])
@token_required(admin=False)
def get_items(current_user: User):
    """
    """
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)
    
    except PermissionError as err:
        return {"error":str(err)}, 401
    except Exception as err:
        return {"error":str(err)}, 400

@redis_api.route('/redis', methods=['DELETE'])
@token_required(admin=False)
def delete_item(current_user: User):
    """
    """
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)
    
    except PermissionError as err:
        return {"error":str(err)}, 401
    except Exception as err:
        return {"error":str(err)}, 400
