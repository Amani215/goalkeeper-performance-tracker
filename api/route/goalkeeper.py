'''Goalkeeper routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.user import User
import service.goalkeeper as goalkeeper_service
from middleware.token_required import token_required

goalkeeper_api = Blueprint('goalkeeper_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@goalkeeper_api.route('/goalkeeper', methods=['POST'])
@token_required(admin=True)
def add_user(current_user: User):
    '''Add a new goalkeeper

    Takes a name and a birthday and returns the new goalkeeper ID.
    If the name already exists the goalkeeper is not added.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        name = request.json['name']
        day = request.json['day']
        month = request.json['month']
        year = request.json['year']
        response = goalkeeper_service.add_goalkeeper(name=name,
                                                     day=day,
                                                     month=month,
                                                     year=year)

        return response.serialize, 201
    except Exception as err:
        return {'error': str(err)}, 400