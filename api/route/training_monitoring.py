'''Match monitoring routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.user import User
import service.training_monitoring as training_monitoring_service
from middleware.token_required import token_required

training_monitoring_api = Blueprint('training_monitoring_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@training_monitoring_api.route('/training_monitoring', methods=['POST'])
@token_required(admin=True)
def add_training_monitoring(current_user: User):
    '''Add a new training monitoring object

    Takes a goalkeeper id and a training session id.
    The composition of both IDs has to be unique.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        goalkeeper_id = request.json['goalkeeper_id']
        session_id = request.json['session_id']
        response = training_monitoring_service.add_training_monitoring(
            goalkeeper_id=goalkeeper_id, session_id=session_id)

        return response.serialize, 201
    except Exception as err:
        return {'error': str(err)}, 400


@training_monitoring_api.route('/training_monitoring', methods=['GET'])
@token_required(admin=False)
def get_training_monitorings(current_user: User):
    '''Get all requested training monitoring objects

    If id is provided then then only the training monitoring object with that id is returned
    '''
    try:
        args = request.args

        if args.get('id') is not None:
            training_monitoring_obj = training_monitoring_service.get_by_id(
                args.get("id"))
        else:
            training_monitorings = training_monitoring_service.get_training_monitorings(
            )
            return jsonify([i.serialize for i in training_monitorings])

        return training_monitoring_obj.serialize
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@training_monitoring_api.route('/training_monitoring', methods=['PUT'])
@token_required(admin=False)
def set_param(current_user: User):
    '''Set the given param(s) to the given value given the training monitoring object ID'''
    try:
        args = request.args

        if not request.json or args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        training_monitoring_obj = training_monitoring_service.get_by_id(
            args.get("id"))
        if (training_monitoring_service.editable(training_monitoring_obj,
                                                 current_user) == False):
            raise PermissionError('User cannot edit this data.')

        possible_bool_params = [
            'absent', 'dismissed', 'hurt', 'with_seniors', 'with_national_team'
        ]
        for param in possible_bool_params:
            if param in request.json:
                response = training_monitoring_service.update_bool_param(
                    args.get('id'), param, request.json[param])
        if 'comment' in request.json:
            response = training_monitoring_service.update_comment(
                args.get('id'), request.json['comment'])

        return response.serialize, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@training_monitoring_api.route('/training_monitoring/form', methods=['PUT'])
@token_required(admin=False)
def add_training_form(current_user: User):
    '''Add a form to the training monitoring
    
    A file has to be passed in request.files and training monitoring ID in the JSON body
    A token is required for the user to be able to upload the file
    The file is automatically uploaded to the given training monitoring object'''
    try:
        args = request.args

        if ((request.files.get('training_form') is None)
                or (args.get('id') is None)):
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        training_monitoring_obj = training_monitoring_service.get_by_id(
            args.get("id"))
        if (training_monitoring_service.editable(training_monitoring_obj,
                                                 current_user) == False):
            raise PermissionError('User cannot edit this data.')

        form = request.files['training_form']

        form_url = training_monitoring_service.update_training_form(
            args.get('id'), form)
        return {'url': form_url}, 201

    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400