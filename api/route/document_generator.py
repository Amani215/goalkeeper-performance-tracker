'''Categories routes (get, post, etc.)'''
import logging
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
    try:
        args = request.args
        return {
            'next_run': scheduler.get_job('generate_attendance').next_run_time
        }
        # if args.get('category_id') is not None and args.get(
        #         'lang') is not None:
        #     return dg.attendance(args.get('category_id'), args.get('lang'))
        # else:
        #     raise ValueError(NO_DATA_PROVIDED_MESSAGE)

    except Exception as err:
        return {'error': str(err)}, 400


@scheduler.task('interval', id='generate_attendance', hours=12)
def generate_attendance():
    with scheduler.app.app_context():
        categories = get_categories()
        for c in categories:
            dg.generate_attendance(c.id, 'fr')
            dg.generate_attendance(c.id, 'en')
