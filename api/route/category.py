'''Categories routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.user import User
import service.category as category_service
from middleware.token_required import token_required

category_api = Blueprint('category_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@category_api.route('/category', methods=['POST'])
@token_required(admin=True)
def add_category(current_user: User):
    '''Add a new category

    Takes a category name and a season and returns the new category ID.
    If the combination of the 2 fields (which is the ID) already exists the category is not added.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        name = request.json['name']
        season = request.json['season']
        category_response = category_service.add_category(name=name,
                                                          season=season)
        return category_response.serialize, 201
    except Exception as err:
        return {'error': str(err)}, 400


@category_api.route('/category', methods=['GET'])
@token_required(admin=False)
def get_categories(current_user: User):
    '''Get all requested categories

    If id is provided then then only the category with that id is returned
    If a category name is provided then all categories with the same name are returned
    If a season is provided then all categories of the same season are returned
    If nothing is provided then all the categories are returned
    '''
    try:
        args = request.args

        if args.get('id') is not None:
            category = category_service.get_by_id(args.get('id'))
            return category.serialize
        elif args.get('name') is not None:
            categories = category_service.get_by_name(args.get('name'))
        elif args.get('season') is not None:
            categories = category_service.get_by_season(args.get('season'))
        else:
            categories = category_service.get_categories()

        return jsonify([i.serialize for i in categories])
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@category_api.route('/category/trainers', methods=['GET'])
@token_required(admin=False)
def get_category_trainers(current_user: User):
    '''Get all requested trainers correponding to the given category

    If id is not provided an error is raised
    '''
    try:
        args = request.args

        trainers = category_service.get_category_trainers(args.get('id'))
        return jsonify([i.serialize for i in trainers])
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
