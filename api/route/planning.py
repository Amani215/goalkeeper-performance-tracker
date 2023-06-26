'''Planning routes'''
from flask.blueprints import Blueprint
from flask import request

from middleware.token_required import token_required
from model.user import User
import service.planning as planning_service
import service.category as category_service

planning_api = Blueprint('planning_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'
NOT_EDITABLE_MESSAGE = 'User is not allowed to modify this category'


@planning_api.route('/planning', methods=['POST'])
@token_required(admin=False)
def add_planning(current_user: User):
    '''Add a planning record

    Takes a date, a category ID and a type of planning. 
    This operation can only be done by allowed users.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        date = request.json['date']
        _type = request.json['type']
        category_id = request.json['category_id']

        category = category_service.get_by_id(category_id)
        if category not in current_user.categories:
            raise PermissionError(NOT_EDITABLE_MESSAGE)

        response = planning_service.add_planning(category_id, date, _type)

        return response.serialize, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@planning_api.route('/planning', methods=['GET'])
@token_required(admin=False)
def get_planning(current_user: User):
    '''
    Get planning by ID
    '''
    try:
        args = request.args
        if args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        response = planning_service.get_by_id(args.get('id'))

        return response.serialize, 200
    except Exception as err:
        return {'error': str(err)}, 400


@planning_api.route('/planning', methods=['PUT'])
@token_required(admin=False)
def set_param(current_user: User):
    '''Set the given param(s) to the given value given the planning object ID
    
    Only users from the same category can edit this object'''
    try:
        args = request.args
        if not request.json or args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        _id = args.get('id')

        planning = planning_service.get_by_id(_id)
        if (planning_service.editable(planning, current_user) == False):
            raise PermissionError(NOT_EDITABLE_MESSAGE)

        possible_params = [
            'type', 'techniques', 'physiques', 'psychomotricity', 'tactics',
            'observation'
        ]
        for param in possible_params:
            if param in request.json:
                planning = planning_service.update_param(
                    _id, param, request.json[param])

        # Update date
        if 'date' in request.json:
            planning = planning_service.set_date(_id,
                                                 date=request.json['date'])

        return planning.serialize, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@planning_api.route('/planning', methods=['DELETE'])
@token_required(admin=False)
def delete(current_user: User):
    '''
    Delete planning object by ID
    
    If ID is not provided an error is raised
    '''
    try:
        args = request.args

        planning = planning_service.get_by_id(args.get('id'))
        if not planning_service.editable(planning, current_user):
            raise PermissionError(NOT_EDITABLE_MESSAGE)

        planning_service.delete(args.get('id'))
        return {}, 204
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
