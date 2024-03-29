'''User routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.category import Category
import service.user as user_service
import service.category as category_service
from middleware.token_required import token_required
from model.user import User

user_api = Blueprint('user_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@user_api.route('/user', methods=['POST'])
@token_required(admin=True)
def add_user(current_user: User):
    '''Add a new user

    Takes a username and a password and returns the new user ID.
    If the username already exists the user is not added.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        username = request.json['username']
        password = request.json['password']
        admin = request.json['admin']
        user_response = user_service.add_user(username=username,
                                              password=password,
                                              admin=admin)

        return user_response.serialize, 201
    except Exception as err:
        return {'error': str(err)}, 400


@user_api.route('/user', methods=['GET'])
@token_required(admin=False)
def get_users(current_user: User):
    '''Get all requested users

    If id is provided then then only the user with that id is returned
    If a username is provided then only the user with that username is returned
    If nothing is provided then all the users are returned
    '''
    try:
        args = request.args

        if args.get('id') is not None:
            user = user_service.get_by_id(args.get("id"))
        elif args.get('username') is not None:
            user = user_service.get_by_username(args.get('username'))
        elif args.get('archived') is not None:
            if args.get('archived').upper() == 'TRUE':
                users = user_service.get_by_archived(True)
            elif args.get('archived').upper() == 'FALSE':
                users = user_service.get_by_archived(False)
            return jsonify([i.serialize for i in users])
        else:
            users = user_service.get_users()
            return jsonify([i.serialize for i in users])

        return user.serialize
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@user_api.route('/user/admin', methods=['PUT'])
@token_required(admin=True)
def set_admin(current_user: User):
    '''Update the admin status of a given user
    
    Only the admin has this right and the admin's default status cannot be changed'''

    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)
        username = request.json['username']
        admin = request.json['admin']

        user_response = user_service.set_admin(username, admin)
        return user_response.serialize, 200

    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@user_api.route('/user/archived', methods=['PUT'])
@token_required(admin=True)
def set_archived(current_user: User):
    '''Update the archived status of a given user
    
    Only the admin has this right and the admin's default status cannot be changed'''

    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)
        username = request.json['username']
        archived = request.json['archived']
        reason = request.json['reason']

        user_response = user_service.set_archived(username, archived, reason)
        return user_response.serialize, 200

    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@user_api.route('/user/category', methods=['GET'])
@token_required(admin=False)
def get_categories(current_user: User):
    '''Get all requested categories correponding to the given user

    If id is not provided an error is raised
    '''
    try:
        args = request.args

        categories = user_service.get_categories(args.get('id'))
        return jsonify([i.serialize for i in categories])
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@user_api.route('/user/category', methods=['PUT'])
@token_required(admin=True)
def add_category(current_user: User):
    '''Add the given category to the list of categories of the given trainer'''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        trainer_id = request.json['trainer_id']
        category_id = request.json['category_id']

        trainer: User = user_service.get_by_id(trainer_id)
        category: Category = category_service.get_by_id(category_id)
        user_service.add_category(trainer, category)
        return {}, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@user_api.route('/user/category', methods=['DELETE'])
@token_required(admin=True)
def remove_category(current_user: User):
    '''Remove the given category from the list of categories of the given trainer'''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        trainer_id = request.json['trainer_id']
        category_id = request.json['category_id']

        trainer: User = user_service.get_by_id(trainer_id)
        category: Category = category_service.get_by_id(category_id)
        user_service.remove_category(trainer, category)

        return {}, 204
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@user_api.route('/user/profile_pic', methods=['PUT'])
@token_required(admin=False)
def add_profile_pic(current_user: User):
    '''Add a profile pic for the user
    
    A file has to be passed in request.files
    A token is required for the user to be able to upload the image
    The image is automatically uploaded to the logged in user'''
    try:
        if request.files.get('profile_pic') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        pic = request.files['profile_pic']
        pic_url = user_service.update_profile_pic(current_user, pic)
        return {'url': pic_url}

    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@user_api.route('/user', methods=['PUT'])
@token_required(admin=False)
def set_password(current_user: User):
    '''Change the password of the given user'''
    try:
        args = request.args
        user = user_service.set_password(args.get('id'),
                                         request.json['password'])
        return user.serialize, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
