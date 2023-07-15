'''Calendar routes'''
from flask.blueprints import Blueprint
from flask import request

from middleware.token_required import token_required
from model.user import User
import service.calendar as calendar_service
import service.category as category_service

calendar_api = Blueprint('calendar_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'
NOT_EDITABLE_MESSAGE = 'User is not allowed to modify this category'


# CALENDARS
@calendar_api.route('/calendar', methods=['POST'])
@token_required(admin=False)
def add_calendar(current_user: User):
    '''Add a calendar

    Takes a calendar type and a category ID. 
    This operation can only be done by allowed users.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        _type = request.json['type']
        category_id = request.json['category_id']

        category = category_service.get_by_id(category_id)
        if category not in current_user.categories:
            raise PermissionError(NOT_EDITABLE_MESSAGE)

        response = calendar_service.add_calendar(_type, category_id)

        return response.serialize, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@calendar_api.route('/calendar', methods=['GET'])
@token_required(admin=False)
def get_calendar(current_user: User):
    '''
    Get calendar by ID
    '''
    try:
        args = request.args
        if args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        response = calendar_service.get_calendar_by_id(args.get('id'))

        return response.serialize, 200
    except Exception as err:
        return {'error': str(err)}, 400


@calendar_api.route('/calendar', methods=['DELETE'])
@token_required(admin=False)
def delete_calendar(current_user: User):
    '''
    Delete calendar object by ID
    
    If ID is not provided an error is raised
    '''
    try:
        args = request.args

        calendar = calendar_service.get_calendar_by_id(args.get('id'))
        if calendar.calendar_category not in current_user.categories:
            raise PermissionError(NOT_EDITABLE_MESSAGE)

        calendar_service.delete_calendar(args.get('id'))
        return {}, 204
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


# ITEMS
@calendar_api.route('/calendar/item', methods=['POST'])
@token_required(admin=False)
def add_calendar_item(current_user: User):
    '''Add a calendar item

    Takes a calendar ID, a journey number, a local team and a visitor team. 
    This operation can only be done by allowed users.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        calendar_id = request.json['calendar_id']
        journey = request.json['journey']
        local = request.json['local']
        visitor = request.json['visitor']

        calendar = calendar_service.get_calendar_by_id(calendar_id)
        if calendar.calendar_category not in current_user.categories:
            raise PermissionError(NOT_EDITABLE_MESSAGE)

        response = calendar_service.add_calendar_item(calendar_id, journey,
                                                      local, visitor)

        return response.serialize, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@calendar_api.route('/calendar/item', methods=['GET'])
@token_required(admin=False)
def get_calendar_item(current_user: User):
    '''
    Get calendar by ID
    '''
    try:
        args = request.args
        if args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        response = calendar_service.get_item_by_id(args.get('id'))

        return response.serialize, 200
    except Exception as err:
        return {'error': str(err)}, 400


@calendar_api.route('/calendar/item', methods=['DELETE'])
@token_required(admin=False)
def delete_calendar_item(current_user: User):
    '''
    Delete calendar item by ID
    
    If ID is not provided an error is raised
    '''
    try:
        args = request.args

        item = calendar_service.get_item_by_id(args.get('id'))
        if item.calendar.calendar_category not in current_user.categories:
            raise PermissionError(NOT_EDITABLE_MESSAGE)

        calendar_service.delete_calendar_item(args.get('id'))
        return {}, 204
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
