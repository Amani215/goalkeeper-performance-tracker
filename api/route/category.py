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
def add_category(current_user:User):
    '''Add a new category

    Takes a category name and a season and returns the new category ID.
    If the combination of the 2 fields (which is the ID) already exists the category is not added.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)
        
        name = request.json['name']
        season = request.json['season']
        category_response = category_service.add_category(name=name, season=season)
        return category_response, 201
    except Exception as err:
        return {'error':str(err)}, 400

@category_api.route('/category', methods = ['GET'])
@token_required(admin=False)
def get_categories(current_user:User):
    '''Get all requested categories

    If id is provided then then only the category with that id is returned
    If a category name is provided then all categories with the same name are returned
    If a season is provided then all categories of the same season are returned
    If nothing is provided then all the categories are returned
    '''
    try:
        if 'id' in request.json:
            category = category_service.get_by_id(request.json['id'])
            return category.serialize
        elif 'name' in request.json:
            categories = category_service.get_by_name(request.json['name'])
        elif 'season' in request.json:
            categories = category_service.get_by_season(request.json['season'])
        else:
            categories = category_service.get_categories()
        
        return jsonify([i.serialize for i in categories])
    except PermissionError as err:
        return {'error':str(err)}, 401
    except Exception as err:
        return {'error':str(err)}, 400