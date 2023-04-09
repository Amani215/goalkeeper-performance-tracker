'''Training monitoring services (add, update, etc.)'''
import os
from sqlalchemy.exc import SQLAlchemyError
from config import db
from model.training_monitoring import training_monitoring
from model.user import User
import service.goalkeeper as goalkeeper_service
import service.training_session as training_session_service
from config.redis import redis_db


def add_training_monitoring(goalkeeper_id: str, session_id: str):
    '''Add a new training monitoring object to the database'''
    goalkeeper = goalkeeper_service.get_by_id(goalkeeper_id)
    session = training_session_service.get_by_id(session_id)

    training_monitoring_obj = training_monitoring(goalkeeper, session)
    training_monitoring_obj.attendance_time = session.duration

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


def update_attendance(training_monitoring_id: str, attendance: str):
    '''Update the attendance'''
    training_monitoring_obj = get_by_id(training_monitoring_id)
    training_monitoring_obj.attendance = attendance
    if attendance.upper() == 'ABSENT':
        training_monitoring_obj.attendance_time = 0

    db.session.commit()
    return training_monitoring_obj


def update_attendance_time(training_monitoring_id: str, attendance_time: int):
    '''Update the attendance timme'''
    training_monitoring_obj = get_by_id(training_monitoring_id)
    training_monitoring_obj.attendance_time = attendance_time

    db.session.commit()
    return training_monitoring_obj


def editable(tm: training_monitoring, user: User) -> bool:
    '''Checks if the user is allowed to edit the given training data'''
    if user.admin:
        return True

    key = f'{tm.id}_editable'
    if redis_db.exists(key) > 0:
        return redis_db.sismember(key, str(user.id))

    s: set = set()
    p = redis_db.pipeline()
    p.multi()
    for t in tm.session.training_session_category.trainers:
        _id = str(t.id)
        s.add(_id)
        p.sadd(key, _id)

    for c in tm.goalkeeper.categories:
        for t in c.trainers:
            _id = str(t.id)
            s.add(_id)
            p.sadd(key, _id)

    p.expire(key, os.getenv('REDIS_CACHE_TTL'))
    p.execute()
    return str(user.id) in s


def delete(id: str):
    '''Deletes the given training performance from the database'''
    tm = get_by_id(id)

    key = f'{id}_editable'
    redis_db.delete(key)

    db.session.delete(tm)
    db.session.commit()
