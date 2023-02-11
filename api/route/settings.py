"""Authentication and Authorization routes"""
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.user import User
from middleware.token_required import token_required
import init.redis_init as redis_db
import service.redis as redis_service

settings_api = Blueprint('settings_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'
POSSIBLE_KEYS = list(redis_db.get_tables().keys())


@settings_api.route('/settings', methods=['POST'])
@token_required(admin=True)
def add_item(current_user: User):
    """
    """
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

    except PermissionError as err:
        return {"error": str(err)}, 401
    except Exception as err:
        return {"error": str(err)}, 400


@settings_api.route('/settings/<key>', methods=['GET'])
@token_required(admin=False)
def get_items(current_user: User, key):
    """
    """
    try:
        if (key not in POSSIBLE_KEYS):
            raise ValueError("No such key exists")
        return jsonify(redis_service.get_items(key))
    except PermissionError as err:
        return {"error": str(err)}, 401
    except Exception as err:
        return {"error": str(err)}, 400


@settings_api.route('/settings', methods=['DELETE'])
@token_required(admin=False)
def delete_item(current_user: User):
    """
    """
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

    except PermissionError as err:
        return {"error": str(err)}, 401
    except Exception as err:
        return {"error": str(err)}, 400
