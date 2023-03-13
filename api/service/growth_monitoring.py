'''Match monitoring services (add, update, etc.)'''
from datetime import datetime
import os
from sqlalchemy.exc import SQLAlchemyError
from config import db
from config.redis import redis_db
from model.growth_monitoring import growth_monitoring
from model.user import User
import service.goalkeeper as goalkeeper_service


def add_growth_monitoring(goalkeeper_id: str, date: str):
    '''Add a new grwoth monitoring object to the database'''
    goalkeeper = goalkeeper_service.get_by_id(goalkeeper_id)
    growth_monitoring_date = datetime.strptime(date, '%d/%m/%Y')

    growth_monitoring_obj = growth_monitoring(goalkeeper,
                                              growth_monitoring_date)

    db.session.add(growth_monitoring_obj)
    db.session.commit()

    return growth_monitoring_obj


def get_growth_monitorings():
    '''Get all growth monitorings'''
    return growth_monitoring.query.all()


def get_by_id(id: str):
    '''Get growth monitoring by ID'''
    try:
        growth_monitoring_obj: growth_monitoring = growth_monitoring.query.filter_by(
            id=id).one()
        return growth_monitoring_obj
    except SQLAlchemyError as err:
        return {'error': str(err)}


def get_by_goalkeeper_id(goalkeeper_id: str):
    '''Get growth monitoring by goalkeepr ID'''
    try:
        growth_monitoring_obj: growth_monitoring = growth_monitoring.query.filter_by(
            goalkeeper_id=goalkeeper_id).all()
        return growth_monitoring_obj
    except SQLAlchemyError as err:
        return {'error': str(err)}


def update_param(growth_monitoring_id: str, param_name: str, param_value: int):
    '''Update params'''
    growth_monitoring_obj = get_by_id(growth_monitoring_id)

    growth_monitoring_obj.__setattr__(param_name, param_value)

    db.session.commit()
    return growth_monitoring_obj


def delete(id: str):
    '''Deletes the given growth object from the database'''
    growth_monitoring_obj = get_by_id(id)

    key = f'{id}_editable'
    redis_db.delete(key)

    db.session.delete(growth_monitoring_obj)
    db.session.commit()


def editable(gm: growth_monitoring, user: User) -> bool:
    '''Checks if the user is allowed to edit the given training data'''
    if user.admin:
        return True

    key = f'{gm.id}_editable'
    if redis_db.exists(key) > 0:
        return redis_db.sismember(key, str(user.id))

    s: set = set()
    p = redis_db.pipeline()
    p.multi()
    for c in gm.goalkeeper.categories:
        for t in c.trainers:
            _id = str(t.id)
            s.add(_id)
            p.sadd(key, _id)

    p.expire(key, os.getenv('REDIS_CACHE_TTL'))
    p.execute()
    return str(user.id) in s
