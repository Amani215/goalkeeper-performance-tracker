'''Goalkeeper routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.category import Category
from model.goalkeeper import Goalkeeper
from model.user import User
import service.goalkeeper as goalkeeper_service
import service.category as category_service
from middleware.token_required import token_required

goalkeeper_api = Blueprint('goalkeeper_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@goalkeeper_api.route('/goalkeeper', methods=['POST'])
@token_required(admin=True)
def add_goalkeeper(current_user: User):
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


@goalkeeper_api.route('/goalkeeper', methods=['GET'])
@token_required(admin=False)
def get_goalkeepers(current_user: User):
    '''Get all requested goalkeepers

    If id is provided then then only the goalkeeper with that id is returned
    If a name is provided then only the goalkeeper with that name is returned
    If nothing is provided then all the goalkeepers are returned'''
    try:
        args = request.args

        if args.get('id') is not None:
            goalkeeper = goalkeeper_service.get_by_id(args.get("id"))
        elif args.get('name') is not None:
            goalkeeper = goalkeeper_service.get_by_name(args.get('name'))
        else:
            goalkeepers = goalkeeper_service.get_goalkeepers()
            return jsonify([i.serialize for i in goalkeepers])

        return goalkeeper.serialize
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@goalkeeper_api.route('/goalkeeper/category', methods=['GET'])
@token_required(admin=False)
def get_categories(current_user: User):
    '''Get all requested categories correponding to the given goalkeeper

    If id is not provided an error is raised
    '''
    try:
        args = request.args

        categories = goalkeeper_service.get_categories(args.get('id'))
        return jsonify([i.serialize for i in categories])
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@goalkeeper_api.route('/goalkeeper/category', methods=['PUT'])
@token_required(admin=True)
def add_category(current_user: User):
    '''Add the given category to the list of categories of the given goalkeeper'''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        goalkeeper_id = request.json['goalkeeper_id']
        category_id = request.json['category_id']

        goalkeeper: Goalkeeper = goalkeeper_service.get_by_id(goalkeeper_id)
        category: Category = category_service.get_by_id(category_id)
        goalkeeper_service.add_category(goalkeeper, category)
        return {}, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@goalkeeper_api.route('/goalkeeper/category', methods=['DELETE'])
@token_required(admin=True)
def remove_category(current_user: User):
    '''Remove the given category from the list of categories of the given goalkeeper'''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        goalkeeper_id = request.json['goalkeeper_id']
        category_id = request.json['category_id']

        goalkeeper: Goalkeeper = goalkeeper_service.get_by_id(goalkeeper_id)
        category: Category = category_service.get_by_id(category_id)
        goalkeeper_service.remove_category(goalkeeper, category)

        return {}, 204
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@goalkeeper_api.route('/goalkeeper/picture', methods=['PUT'])
@token_required(admin=False)
def add_picture(current_user: User):
    '''Add a pic for the goalkeeper
    
    A file has to be passed in request.files and goalkeeper ID in the JSON body
    A token is required for the user to be able to upload the image
    The image is automatically uploaded to the given goalkeeper'''
    try:
        args = request.args

        if ((request.files.get('picture') is None)
                or (args.get('id') is None)):
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        goalkeeper: Goalkeeper = goalkeeper_service.get_by_id(args.get('id'))
        if (goalkeeper_service.editable(goalkeeper, current_user) == False):
            raise PermissionError('User cannot edit this goalkeeper.')

        pic = request.files['picture']
        pic_url = goalkeeper_service.update_picture(goalkeeper, pic)
        return {'url': pic_url}

    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@goalkeeper_api.route('/goalkeeper/match_performances', methods=['GET'])
@token_required(admin=False)
def get_match_performances(current_user: User):
    '''Get all rthe match performances of the given goalkeeper
    '''
    try:
        args = request.args

        match_performances = goalkeeper_service.get_match_performances(
            args.get('id'))
        return jsonify([i.serialize for i in match_performances])
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@goalkeeper_api.route('/goalkeeper/training_performances', methods=['GET'])
@token_required(admin=False)
def get_training_performances(current_user: User):
    '''Get all rthe training performances of the given goalkeeper
    '''
    try:
        args = request.args

        training_performances = goalkeeper_service.get_training_performances(
            args.get('id'))
        return jsonify([i.serialize for i in training_performances])
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
