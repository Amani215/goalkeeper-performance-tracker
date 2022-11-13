'''Training session services (add, update, etc.)'''
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from config.postgres import db
from model.training_session import training_session
import service.category as category_service
from config.redis import redis_db


def add_training_session(date: str, duration: int, category_id: str):
    '''Add a new training session to the database'''
    training_session_date = datetime.strptime(date, '%d/%m/%Y %H:%M')
    category = category_service.get_by_id(category_id)
    training_session_obj = training_session(training_session_date, duration,
                                            category)

    db.session.add(training_session_obj)
    db.session.commit()

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
