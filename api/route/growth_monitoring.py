'''Match monitoring routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.user import User
import service.growth_monitoring as growth_monitoring_service
from middleware.token_required import token_required

growth_monitoring_api = Blueprint('growth_monitoring_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@growth_monitoring_api.route('/growth_monitoring', methods=['POST'])
@token_required(admin=True)
def add_growth_monitoring(current_user: User):
    '''Add a new growth monitoring object

    Takes a goalkeeper id and a date.
    The parameter pair has to be unique.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        goalkeeper_id = request.json['goalkeeper_id']
        date = request.json['date']
        response = growth_monitoring_service.add_growth_monitoring(
            goalkeeper_id=goalkeeper_id, date=date)

        return response.serialize, 201
    except Exception as err:
        return {'error': str(err)}, 400


@growth_monitoring_api.route('/growth_monitoring', methods=['GET'])
@token_required(admin=False)
def get_growth_monitorings(current_user: User):
    '''Get all requested growth monitoring objects

    If id is provided then then only the growth monitoring object with that id is returned
    '''
    try:
        args = request.args

        if args.get('id') is not None:
            growth_monitoring_obj = growth_monitoring_service.get_by_id(
                args.get("id"))
        else:
            growth_monitorings = growth_monitoring_service.get_growth_monitorings(
            )
            return jsonify([i.serialize for i in growth_monitorings])

        return growth_monitoring_obj.serialize
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@growth_monitoring_api.route('/growth_monitoring', methods=['PUT'])
@token_required(admin=False)
def set_param(current_user: User):
    '''Set the given param(s) to the given value given the match monitoring object ID'''
    try:
        args = request.args

        if not request.json or args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        possible_params = [
            'weight', 'height', 'torso_height', 'thoracic_perimeter',
            'annual_growth'
        ]
        for param in possible_params:
            if param in request.json:
                growth_monitoring_service.update_param(args.get('id'), param,
                                                       request.json[param])

        return {}, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
