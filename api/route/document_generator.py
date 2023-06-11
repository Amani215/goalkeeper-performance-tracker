'''Categories routes (get, post, etc.)'''
from flask import request
from flask.blueprints import Blueprint
import service.document_generator as dg

document_generator_api = Blueprint('document_generator_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@document_generator_api.route('/doc/goalkeepers')
def goalkeepers():
    try:
        args = request.args
        if args.get('category_id') is not None:
            return {
                'link': dg.goalkeepers_per_category(args.get('category_id'))
            }
        else:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

    except Exception as err:
        return {'error': str(err)}, 400


@document_generator_api.route('/doc/attendance')
def attendance():
    try:
        args = request.args
        if args.get('category_id') is not None:
            return dg.attendance(args.get('category_id'), 'fr')
        else:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

    except Exception as err:
        return {'error': str(err)}, 400
