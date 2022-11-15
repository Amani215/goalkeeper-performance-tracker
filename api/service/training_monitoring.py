'''Training monitoring services (add, update, etc.)'''
from cgi import FieldStorage
import os
from sqlalchemy.exc import SQLAlchemyError
from config.postgres import db
from model.training_monitoring import training_monitoring
from model.user import User
import service.goalkeeper as goalkeeper_service
import service.training_session as training_session_service
from service.s3 import upload_file
from config.redis import redis_db


def add_training_monitoring(goalkeeper_id: str, session_id: str):
    '''Add a new training monitoring object to the database'''
    goalkeeper = goalkeeper_service.get_by_id(goalkeeper_id)
    session = training_session_service.get_by_id(session_id)

    training_monitoring_obj = training_monitoring(goalkeeper, session)

    db.session.add(training_monitoring_obj)
    db.session.commit()

    return training_monitoring_obj


def get_training_monitorings():
    '''Get all training monitorings'''
    return training_monitoring.query.all()


def get_by_id(id: str):
    '''Get training monitoring by ID'''
    try:
        training_monitoring_obj: training_monitoring = training_monitoring.query.filter_by(
            id=id).one()
        return training_monitoring_obj
    except SQLAlchemyError as err:
        return {'error': str(err)}


def update_bool_param(training_monitoring_id: str, param_name: str,
                      param_value: bool):
    '''Update a boolean param'''
    training_monitoring_obj = get_by_id(training_monitoring_id)

    training_monitoring_obj.__setattr__(param_name, param_value)

    db.session.commit()
    return training_monitoring_obj


def update_comment(training_monitoring_id: str, comment: str):
    '''Update the comment'''
    training_monitoring_obj = get_by_id(training_monitoring_id)
    training_monitoring_obj.comment = comment

    db.session.commit()
    return training_monitoring_obj


def update_training_form(training_monitoring_id: str, pic: FieldStorage):
    '''Set or change the link to the training form of the training monitoring object'''
    training_monitoring_obj = get_by_id(training_monitoring_id)

    form_url = upload_file(pic, os.getenv('TRAINING_FORMS_BUCKET'))
    training_monitoring_obj.training_form = form_url

    db.session.commit()
    return form_url


def editable(tm: training_monitoring, user: User) -> bool:
    if user.admin:
        return True

    key = f'{tm.id}_editable'
    if redis_db.exists(key) > 0:
        return redis_db.sismember(key, str(user.id))

    s: set = set()
    for t in tm.session.training_session_category.trainers:
        _id = str(t.id)
        s.add(_id)
        redis_db.sadd(key, _id)

    for c in tm.goalkeeper.categories:
        for t in c.trainers:
            _id = str(t.id)
            s.add(_id)
            redis_db.sadd(key, _id)

    return str(user.id) in s


def delete(id: str):
    '''Deletes the given training performance from the database'''
    tm = get_by_id(id)

    key = f'{id}_editable'
    redis_db.delete(key)

    db.session.delete(tm)
    db.session.commit()
