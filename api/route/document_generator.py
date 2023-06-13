'''Categories routes (get, post, etc.)'''
from flask import request
from flask.blueprints import Blueprint
from init.scheduler_init import scheduler
from service.category import get_categories
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
    '''
    Get the attendance document of a specific category in a specific language.
    The generation of a document can be forced in case it is not up to date.
    '''
    try:
        args = request.args
        if args.get('category_id') is not None and args.get(
                'lang') is not None:
            if args.get('force') is not None and args.get('force') == 'true':
                return dg.attendance(args.get('category_id'), args.get('lang'),
                                     True)

            else:
                return dg.attendance(args.get('category_id'), args.get('lang'))
        else:
            raise ValueError(NO_DATA_PROVIDED_MESSAGE)

    except Exception as err:
        return {'error': str(err)}, 400


@scheduler.task('interval', id='generate_attendance', hours=12)
def generate_attendance():
    '''Generate an attendance document every 12 hours.'''
    with scheduler.app.app_context():
        categories = get_categories()
        for c in categories:
            dg.generate_attendance(c.id, 'fr')
            dg.generate_attendance(c.id, 'en')
