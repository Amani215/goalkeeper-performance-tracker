'''Match routes (get, post, etc.)'''
from flask import jsonify, request
from flask.blueprints import Blueprint
from model.category import Category
from model.match import Match
from model.user import User
import service.match as match_service
import service.category as category_service
from middleware.token_required import token_required

match_api = Blueprint('match_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@match_api.route('/match', methods=['POST'])
@token_required(admin=True)
def add_match(current_user: User):
    '''Add a new match

    Takes a date, a local team name, a visitor team name and a match type and returns the new match object.
    There are no uniqueness requirements.
    '''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        date = request.json['date']
        local = request.json['local']
        visitor = request.json['visitor']
        match_type = request.json['match_type']
        response = match_service.add_match(date=date,
                                           local=local,
                                           visitor=visitor,
                                           match_type=match_type)

        return response.serialize, 201
    except Exception as err:
        return {'error': str(err)}, 400


@match_api.route('/match', methods=['GET'])
@token_required(admin=False)
def get_matches(current_user: User):
    '''Get all requested matches

    If id is provided then then only the match with that id is returned
    If before date is provided then only matches before that given date (included) are returned
    If after date is provided then only matches after that given date (included) are returned
    '''
    try:
        args = request.args

        if args.get('id') is not None:
            match = match_service.get_by_id(args.get("id"))
            return match.serialize
        elif args.get('before') is not None:
            matches = match_service.get_by_date_before(args.get("before"))
        elif args.get('after') is not None:
            matches = match_service.get_by_date_after(args.get("after"))
        else:
            matches = match_service.get_matches()

        return jsonify([i.serialize for i in matches])
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@match_api.route('/match/category', methods=['GET'])
@token_required(admin=False)
def get_category(current_user: User):
    '''Get the category correponding to the given match

    If id is not provided an error is raised
    '''
    try:
        args = request.args

        match = match_service.get_by_id(args.get('id'))
        category = category_service.get_by_id(match.category_id)
        return category.serialize, 200
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@match_api.route('/match/category', methods=['PUT'])
@token_required(admin=True)
def set_category(current_user: User):
    '''Set the given category as the category of the given match'''
    try:
        if not request.json:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        match_id = request.json['match_id']
        category_id = request.json['category_id']

        match: Match = match_service.get_by_id(match_id)
        category: Category = category_service.get_by_id(category_id)
        match_service.set_category(match, category)
        return {}, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@match_api.route('/match/score', methods=['PUT'])
@token_required(admin=True)
def set_scores(current_user: User):
    '''Set the scores. If score is not provided then it is not changed'''
    try:
        args = request.args

        if not request.json or args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        score_local = -1
        score_visitor = -1
        if 'score_local' in request.json:
            score_local = request.json['score_local']
        if 'score_visitor' in request.json:
            score_visitor = request.json['score_visitor']

        response = match_service.set_scores(args.get('id'), score_local,
                                            score_visitor)

        return response.serialize, 201
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400


@match_api.route('/match/performances', methods=['GET'])
@token_required(admin=False)
def get_goalkeepers_performances(current_user: User):
    '''Set the scores. If score is not provided then it is not changed'''
    try:
        args = request.args

        if args.get('id') is None:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

        performances = match_service.get_goalkeepers_performances(
            args.get('id'))

        return jsonify([i.serialize for i in performances])
    except PermissionError as err:
        return {'error': str(err)}, 401
    except Exception as err:
        return {'error': str(err)}, 400
