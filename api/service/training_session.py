'''Training session services (add, update, etc.)'''
from cgi import FieldStorage
from datetime import datetime
import os
from sqlalchemy.exc import SQLAlchemyError
from config import db
from model.training_session import training_session
import service.category as category_service
from service.s3 import upload_file
import service.training_monitoring as training_monitoring_service
import service.goalkeeper as goalkeeper_service
from config.redis import redis_db
from service.training_monitoring import add_training_monitoring


def add_training_session(date: str, duration: int, category_id: str):
    '''Add a new training session to the database'''
    training_session_date = datetime.strptime(date, '%d/%m/%Y')
    category = category_service.get_by_id(category_id)
    training_session_obj = training_session(training_session_date, duration,
                                            category)

    db.session.add(training_session_obj)
    db.session.commit()

    for goalkeeper in category.goalkeepers:
        add_training_monitoring(goalkeeper_id=goalkeeper.id,
                                session_id=training_session_obj.id)

    return training_session_obj


def get_training_sessions():
    '''Get all training sessions'''
    return training_session.query.all()


def get_by_id(id):
    '''Get training session by ID'''
    try:
        training_session_obj: training_session = training_session.query.filter_by(
            id=id).one()
        return training_session_obj
    except SQLAlchemyError as err:
        return {'error': str(err)}


def get_by_category(category_id: str):
    '''Get training session by Category'''
    try:
        return training_session.query.filter_by(
            training_session_category_id=category_id).all()
    except SQLAlchemyError as err:
        return {'error': str(err)}


def update_category(training_session_id: str, category_id: str):
    '''Update the category of the training session'''
    training_session_obj = get_by_id(training_session_id)
    category = category_service.get_by_id(category_id)

    for gp in training_session_obj.goalkeepers_performances:
        key = f'{gp.id}_editable'
        redis_db.delete(key)

    training_session_obj.training_session_category = category
    db.session.commit()
    return training_session_obj


def get_goalkeepers_performances(session_id: str):
    '''Returns the match monitoring objects belonging to the given ID'''
    session = get_by_id(session_id)
    return session.goalkeepers_performances


def remove_goalkeeper_performance(session_id: str,
                                  goalkeeper_performance_id: str):
    '''Remove a goalkeeper's performance from the match'''
    gp = training_monitoring_service.get_by_id(goalkeeper_performance_id)
    goalkeeper_service.remove_training_performance(gp.goalkeeper.id, gp)

    session = get_by_id(session_id)
    session.goalkeepers_performances.remove(gp)

    training_monitoring_service.delete(goalkeeper_performance_id)
    db.session.commit()


def update_training_form(training_id: str, pic: FieldStorage):
    '''Set or change the link to the training form of the training monitoring object'''
    training_obj = get_by_id(training_id)

    form_url = upload_file(pic, os.getenv('TRAINING_FORMS_BUCKET'))
    training_obj.training_form = form_url

    db.session.commit()
    return form_url


def delete(training_id: str):
    '''Delete a training session given its ID'''
    ts = get_by_id(training_id)

    if (len([i for i in ts.goalkeepers_performances]) > 0):
        raise PermissionError("This training is connected to other entities")
    else:
        db.session.delete(ts)
        db.session.commit()
