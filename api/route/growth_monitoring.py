'''Match monitoring routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from model import growth_monitoring
from model.user import User
import service.growth_monitoring as growth_monitoring_service
import service.goalkeeper as goalkeeper_service
from middleware.token_required import token_required

growth_monitoring_api = Blueprint('growth_monitoring_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'
NOT_EDITABLE_MESSAGE = 'User cannot edit this goalkeeper.'


@growth_monitoring_api.route('/growth_monitoring', methods=['POST'])
@token_required(admin=False)
def add_growth_monitoring(current_user: User):
    '''Add a new growth monitoring object

    Takes a goalkeeper id and a date.
    The parameter pair has to be unique.
    
    Only users from the same category can edit this object
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        goalkeeper_id = request.json['goalkeeper_id']
        goalkeeper = goalkeeper_service.get_by_id(goalkeeper_id)
        if (goalkeeper_service.editable(goalkeeper, current_user) == False):
            raise PermissionError(NOT_EDITABLE_MESSAGE)

        date = request.json['date']
        response = growth_monitoring_service.add_growth_monitoring(
            goalkeeper_id=goalkeeper_id, date=date)

        return response.serialize, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@growth_monitoring_api.route('/growth_monitoring', methods=['GET'])
@token_required(admin=False)
def get_growth_monitorings(current_user: User):
    '''Get all requested growth monitoring objects

    If id is provided then then only the growth monitoring object with that id is returned
    If gid is provided then then only the growth monitoring objects with that goalkeeper id is returned    
    '''
    try:
        args = request.args

        if args.get('id') is not None:
            growth_monitoring_obj = growth_monitoring_service.get_by_id(
                args.get("id"))
        elif args.get('gid') is not None:
            growth_monitorings = growth_monitoring_service.get_by_goalkeeper_id(
                args.get("gid"))
            return jsonify([i.serialize for i in growth_monitorings])
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
    '''Set the given param(s) to the given value given the growth monitoring object ID
    
    Only users from the same category can edit this object'''
    try:
        args = request.args

        if not request.json or args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        gm_id = args.get('id')

        goalkeeper = growth_monitoring_service.get_by_id(gm_id).goalkeeper
        if (goalkeeper_service.editable(goalkeeper, current_user) == False):
            raise PermissionError(NOT_EDITABLE_MESSAGE)

        growth: growth_monitoring = growth_monitoring_service.get_by_id(gm_id)

        possible_params = [
            'weight', 'height', 'torso_height', 'thoracic_perimeter',
            'annual_growth'
        ]
        for param in possible_params:
            if param in request.json:
                growth = growth_monitoring_service.update_param(
                    gm_id, param, request.json[param])

        # Update date
        if 'date' in request.json:
            growth = growth_monitoring_service.set_date(
                growth, date=request.json['date'])

        return growth.serialize, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@growth_monitoring_api.route('/growth_monitoring', methods=['DELETE'])
@token_required(admin=False)
def delete(current_user: User):
    '''
    Delete growth monitoring object by ID
    
    If ID is not provided an error is raised
    '''
    try:
        args = request.args

        growth_monitoring_service.delete(args.get('id'))
        return {}, 204
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
