'''Match monitoring routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.user import User
import service.match_monitoring as match_monitoring_service
from middleware.token_required import token_required

match_monitoring_api = Blueprint('match_monitoring_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@match_monitoring_api.route('/match_monitoring', methods=['POST'])
@token_required(admin=True)
def add_match_monitoring(current_user: User):
    '''Add a new match monitoring object

    Takes a goalkeeper id and a match id.
    The composition of both IDs has to be unique.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        goalkeeper_id = request.json['goalkeeper_id']
        match_id = request.json['match_id']

        response = match_monitoring_service.add_match_monitoring(
            goalkeeper_id=goalkeeper_id, match_id=match_id)

        return response.serialize, 201
    except Exception as err:
        return {'error': str(err)}, 400


@match_monitoring_api.route('/match_monitoring', methods=['GET'])
@token_required(admin=False)
def get_match_monitorings(current_user: User):
    '''Get all requested match monitoring objects

    If id is provided then then only the match monitoring object with that id is returned
    '''
    try:
        args = request.args

        if args.get('id') is not None:
            match_monitoring_obj = match_monitoring_service.get_by_id(
                args.get("id"))
        else:
            match_monitorings = match_monitoring_service.get_match_monitorings(
            )
            return jsonify([i.serialize for i in match_monitorings])

        return match_monitoring_obj.serialize
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@match_monitoring_api.route('/match_monitoring', methods=['PUT'])
@token_required(admin=False)
def set_param(current_user: User):
    '''Set the given param(s) to the given value given the match monitoring object ID'''
    try:
        args = request.args

        if not request.json or args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        match_monitoring_obj = match_monitoring_service.get_by_id(
            args.get("id"))

        if (match_monitoring_service.editable(match_monitoring_obj,
                                              current_user) == False):
            raise PermissionError('User cannot edit this data.')

        possible_params = [
            'goalkeeper_order', 'time_played', 'goals_scored',
            'goals_conceded', 'penalties_saved', 'penalties_non_saved',
            'successful_deliveries', 'non_successful_deliveries',
            'successful_ballon_profondeur', 'non_successful_ballon_profondeur',
            'successful_hand_relaunch', 'non_successful_hand_relaunch',
            'successful_foot_relaunch', 'non_successful_foot_relaunch',
            'balls_touched', 'yellow_cards', 'red_cards', 'grade', 'comment'
        ]
        for param in possible_params:
            if param in request.json:
                match_monitoring_service.update_param(args.get('id'), param,
                                                      request.json[param])

        return {}, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
