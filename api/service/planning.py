'''Planning Services'''
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
import os

from config import db
from config.redis import redis_db
from model.planning import Planning
from model.user import User
import service.category as category_service


def add_planning(category_id: str, date: str, type: str) -> Planning:
    '''Add a planning record to the given category'''
    _date = datetime.strptime(date, '%d/%m/%Y')
    category = category_service.get_by_id(category_id)

    planning = Planning(category, _date, type)

    db.session.add(planning)
    db.session.commit()

    return planning


def get_by_id(id):
    '''Get planning by ID'''
    try:
        planning: Planning = Planning.query.filter_by(id=id).one()
        return planning
    except SQLAlchemyError as err:
        return {'error': str(err)}


def set_date(planning_id: str, date: str = None) -> Planning:
    '''Set the date of the planning'''
    planning = get_by_id(planning_id)

    if (date is not None and date != ''):
        planning.date = datetime.strptime(date, '%d/%m/%Y')
    db.session.commit()
    return planning


def update_param(planning_id: str, param_name: str, param_value) -> Planning:
    '''Set the given parameter to the given parameter value'''
    planning = get_by_id(planning_id)

    planning.__setattr__(param_name, param_value)

    db.session.commit()
    return planning


def editable(planning: Planning, user: User) -> bool:
    '''Checks if the user is allowed to edit the given planning'''
    if user.admin:
        return True

    key = f'{planning.id}_editable'
    if redis_db.exists(key) > 0:
        return redis_db.sismember(key, str(user.id))

    s: set = set()
    p = redis_db.pipeline()
    p.multi()
    for t in planning.category.trainers:
        _id = str(t.id)
        s.add(_id)
        p.sadd(key, _id)

    p.expire(key, os.getenv('REDIS_CACHE_TTL'))
    p.execute()
    return str(user.id) in s


def delete(id: str):
    '''Deletes the given planning record from the database'''
    planning = get_by_id(id)

    key = f'{id}_editable'
    redis_db.delete(key)

    db.session.delete(planning)
    db.session.commit()
