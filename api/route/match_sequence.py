'''Match sequence routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from middleware.token_required import token_required
from model.user import User
import service.match_sequence as match_sequence_service

match_sequence_api = Blueprint('match_sequence_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@match_sequence_api.route('/match_sequence', methods=['POST'])
@token_required(admin=True)
def add_match_sequence(current_user: User):
    '''Add a match sequence'''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        performance_id = request.json['match_performance_id']

        response = match_sequence_service.add_match_sequence(performance_id)

        return response.serialize, 201
    except Exception as err:
        return {'error': str(err)}, 400


@match_sequence_api.route('/match_sequence', methods=['GET'])
@token_required(admin=False)
def get_match_sequence(current_user: User):
    '''Get match sequence by id'''
    try:
        args = request.args

        if args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        ms = match_sequence_service.get_by_id(args.get('id'))
        return ms.serialize
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@match_sequence_api.route('/match_sequence', methods=['PUT'])
@token_required(admin=False)
def set_param(current_user: User):
    '''Update a parameter'''
    try:
        args = request.args

        if not request.json or args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        ms = match_sequence_service.get_by_id(args.get("id"))

        if (match_sequence_service.editable(ms, current_user) == False):
            raise PermissionError('User cannot edit this data.')

        possible_params = [
            'sequence_number', 'action_type', 'reaction_type', 'action_result',
            'comment'
        ]
        for param in possible_params:
            if param in request.json:
                match_sequence_service.update_param(args.get('id'), param,
                                                    request.json[param])

        return {}, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@match_sequence_api.route('/match_sequence', methods=['DELETE'])
@token_required(admin=False)
def delete(current_user: User):
    '''
    Delete match sequence by ID
    
    If ID is not provided an error is raised
    '''
    try:
        args = request.args

        match_sequence_service.delete(args.get('id'))
        return {}, 204
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
