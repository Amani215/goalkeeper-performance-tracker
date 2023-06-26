'''Planning routes'''
from flask.blueprints import Blueprint
from flask import jsonify, request

from middleware.token_required import token_required
from model.user import User
import service.planning as planning_service
import service.category as category_service

planning_api = Blueprint('planning_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


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
            raise PermissionError(
                'User is not allowed to modify this category')

        response = planning_service.add_planning(category_id, date, _type)

        return response.serialize, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
