'''Training session routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.user import User
import service.training_session as training_session_service
import service.category as category_service
from middleware.token_required import token_required

training_session_api = Blueprint('training_session_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@training_session_api.route('/training_session', methods=['POST'])
@token_required(admin=True)
def add_training_session(current_user: User):
    '''Add a new training session

    Takes a date, a durationand a category id and returns the new training session object.
    There date and category pair has to be unique.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        date = request.json['date']
        duration = request.json['duration']
        category_id = request.json['category_id']
        response = training_session_service.add_training_session(
            date=date, duration=duration, category_id=category_id)

        return response.serialize, 201
    except Exception as err:
        return {'error': str(err)}, 400


@training_session_api.route('/training_session', methods=['GET'])
@token_required(admin=False)
def get_training_sessions(current_user: User):
    '''Get all requested training sessions

    If id is provided then then only the training session with that id is returned
    If category id is provided then only the training sessions with that category are returned
    '''
    try:
        args = request.args

        if args.get('id') is not None:
            training_session = training_session_service.get_by_id(
                args.get("id"))
            return training_session.serialize
        elif args.get('category_id') is not None:
            training_sessions = training_session_service.get_by_category(
                args.get("category_id"))
        else:
            training_sessions = training_session_service.get_training_sessions(
            )

        return jsonify([i.serialize for i in training_sessions])
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@training_session_api.route('/training_session/category', methods=['GET'])
@token_required(admin=False)
def get_category(current_user: User):
    '''Get the category correponding to the given training session

    If id is not provided an error is raised
    '''
    try:
        args = request.args

        training_session = training_session_service.get_by_id(args.get('id'))
        category = category_service.get_by_id(
            training_session.training_session_category_id)
        return category.serialize, 200
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@training_session_api.route('/training_session/category', methods=['PUT'])
@token_required(admin=True)
def set_category(current_user: User):
    '''Set the given category as the category of the given training session'''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        training_session_id = request.json['training_session_id']
        category_id = request.json['category_id']

        training_session_service.update_category(
            training_session_id=training_session_id, category_id=category_id)
        return {}, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@training_session_api.route('/training_session/performances', methods=['GET'])
@token_required(admin=False)
def get_goalkeepers_performances(current_user: User):
    '''Get the goalkeeper performances of the given training session'''
    try:
        args = request.args

        if args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        performances = training_session_service.get_goalkeepers_performances(
            args.get('id'))

        return jsonify([i.serialize for i in performances])
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@training_session_api.route('/training_session/performances',
                            methods=['DELETE'])
@token_required(admin=True)
def remove_goalkeepers_performance(current_user: User):
    '''Remove a goalkeeper performance by id'''
    try:
        args = request.args

        if not request.json or args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        training_session_service.remove_goalkeeper_performance(
            args.get('id'), request.json['goalkeeper_performance_id'])

        return {}, 204
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@training_session_api.route('/training_session/form', methods=['PUT'])
@token_required(admin=False)
def add_training_form(current_user: User):
    '''Add a form to the training
    
    A file has to be passed in request.files and training ID in the JSON body
    A token is required for the user to be able to upload the file
    The file is automatically uploaded to the given training monitoring object'''
    try:
        args = request.args

        if ((request.files.get('training_form') is None)
                or (args.get('id') is None)):
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        form = request.files['training_form']
        form_url = training_session_service.update_training_form(
            args.get('id'), form)
        return {'url': form_url}, 201

    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@training_session_api.route('/training_session', methods=['DELETE'])
@token_required(admin=True)
def delete_training_session(current_user: User):
    '''
    Delete training session by ID
    
    Only admin users are allowed to do this
    If ID is not provided an error is raised
    '''
    try:
        args = request.args

        training_session_service.delete(args.get('id'))
        return {}, 204
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
