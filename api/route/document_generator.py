'''Categories routes (get, post, etc.)'''
from flask import render_template
from flask.blueprints import Blueprint
from service.document_generator import test_doc

document_generator_api = Blueprint('document_generator_api', __name__)

NO_DATA_PROVIDED_MESSAGE = 'No data was provided'


@document_generator_api.route('/doc/goalkeepers')
def goalkeepers():
    return test_doc()
