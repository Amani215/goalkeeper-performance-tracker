'''Categories routes (get, post, etc.)'''
from flask import render_template, request
from flask.blueprints import Blueprint
from service.document_generator import test_doc

document_generator_api = Blueprint('document_generator_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@document_generator_api.route('/doc/goalkeepers')
def goalkeepers():
    try:
        args = request.args
        if args.get('category_id') is not None:
            return test_doc(args.get('category_id'))
        else:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

    except Exception as err:
        return {'error': str(err)}, 400