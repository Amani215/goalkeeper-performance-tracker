'''Match monitoring services (add, update, etc.)'''
from sqlalchemy.exc import SQLAlchemyError
from config import db
from model.match_monitoring import match_monitoring
from model.user import User
import service.goalkeeper as goalkeeper_service
import service.match as match_service
from config.redis import redis_db


def add_match_monitoring(goalkeeper_id: str, match_id: str):
    '''Add a new match monitoring object to the database'''
    goalkeeper = goalkeeper_service.get_by_id(goalkeeper_id)
    match = match_service.get_by_id(match_id)

    match_monitoring_obj = match_monitoring(goalkeeper, match)

    db.session.add(match_monitoring_obj)
    db.session.commit()

    return match_monitoring_obj


def get_match_monitorings():
    '''Get all match monitorings'''
    return match_monitoring.query.all()


def get_by_id(id: str):
    '''Get match monitoring by ID'''
    try:
        match_monitoring_obj: match_monitoring = match_monitoring.query.filter_by(
            id=id).one()
        return match_monitoring_obj
    except SQLAlchemyError as err:
        return {'error': str(err)}


def update_param(match_monitoring_id: str, param_name: str, param_value):
    '''Set the substitute of the goalkeeper'''
    match_monitoring_obj = get_by_id(match_monitoring_id)

    match_monitoring_obj.__setattr__(param_name, param_value)

    db.session.commit()
    return match_monitoring_obj


def editable(mm: match_monitoring, user: User) -> bool:
    if user.admin:
        return True

    key = f'{mm.id}_editable'
    if redis_db.exists(key) > 0:
        return redis_db.sismember(key, str(user.id))

    s: set = set()
    for t in mm.match.match_category.trainers:
        _id = str(t.id)
        s.add(_id)
        redis_db.sadd(key, _id)

    for c in mm.main_goalkeeper.categories:
        for t in c.trainers:
            _id = str(t.id)
            s.add(_id)
            redis_db.sadd(key, _id)

    return str(user.id) in s


def delete(id: str):
    '''Deletes the given match performance from the database'''
    mm = get_by_id(id)

    key = f'{id}_editable'
    redis_db.delete(key)

    db.session.delete(mm)
    db.session.commit()
