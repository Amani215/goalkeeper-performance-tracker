'''Healthcheck endpoint'''

from flask import Blueprint


health = Blueprint('health', __name__)

@health.route('/health', methods=['GET'])
def healthcheck():
    '''Healthcheck endpoint.'''
    return {}, 200
