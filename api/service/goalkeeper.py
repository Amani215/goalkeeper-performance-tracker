'''Goalkeeper services (add, update, etc.)'''
import datetime
import os
from cgi import FieldStorage
from sqlalchemy.exc import SQLAlchemyError
from config import db
from model.category import Category
from model.goalkeeper import Goalkeeper
from model.user import User
from service.s3 import upload_file
from config.redis import redis_db
from model.match_monitoring import match_monitoring
from model.training_monitoring import training_monitoring


def add_goalkeeper(name: str, day: int, month: int, year: int):
    '''Add a new goalkeeper to the database'''
    birthday = datetime.date(year, month, day)
    goalkeeper = Goalkeeper(name, birthday)

    db.session.add(goalkeeper)
    db.session.commit()

    return goalkeeper


def get_goalkeepers():
    '''Get all goalkeepers'''
    return Goalkeeper.query.all()


def get_by_name(name: str):
    '''Get goalkeeper by name'''
    goalkeeper: Goalkeeper = Goalkeeper.query.filter_by(name=name).one()
    return goalkeeper


def get_by_id(id):
    '''Get goalkeeper by ID'''
    try:
        goalkeeper: Goalkeeper = Goalkeeper.query.filter_by(id=id).one()
        return goalkeeper
    except SQLAlchemyError as err:
        return {'error': str(err)}


def get_categories(goalkeeper_id):
    '''Get categories of the given goalkeeper'''
    try:
        goalkeeper: Goalkeeper = Goalkeeper.query.filter_by(
            id=goalkeeper_id).one()
        return goalkeeper.categories
    except SQLAlchemyError as err:
        return {'error': str(err)}


def add_category(goalkeeper: Goalkeeper, category: Category):
    '''Add a category to the goalkeeper'''
    key = f'{goalkeeper.id}_editable'
    redis_db.delete(key)

    goalkeeper_matches = goalkeeper.match_performances
    for mm in goalkeeper_matches:
        key = f'{mm.id}_editable'
        redis_db.delete(key)

    goalkeeper_trainings = goalkeeper.training_performances
    for tm in goalkeeper_trainings:
        key = f'{tm.id}_editable'
        redis_db.delete(key)

    goalkeeper.categories.append(category)
    db.session.commit()
    return {'goalkeeper_id': goalkeeper.id, 'category_id': category.id}


def remove_category(goalkeeper: Goalkeeper, category: Category):
    '''Remove a category from the goalkeeper's list'''
    key = f'{goalkeeper.id}_editable'
    redis_db.delete(key)

    goalkeeper_matches = goalkeeper.match_performances
    for mm in goalkeeper_matches:
        key = f'{mm.id}_editable'
        redis_db.delete(key)

    goalkeeper_trainings = goalkeeper.training_performances
    for tm in goalkeeper_trainings:
        key = f'{tm.id}_editable'
        redis_db.delete(key)

    goalkeeper.categories.remove(category)
    db.session.commit()


def update_picture(goalkeeper: Goalkeeper, pic: FieldStorage):
    '''Set or change the link to the profile pic of the goalkeeper'''
    pic_url = upload_file(pic, os.getenv('GOALKEEPER_PICS_BUCKET'))
    goalkeeper.picture = pic_url
    db.session.commit()
    return pic_url


def editable(goalkeeper: Goalkeeper, user: User) -> bool:
    if user.admin:
        return True

    key = f'{goalkeeper.id}_editable'
    if redis_db.exists(key) > 0:
        return redis_db.sismember(key, str(user.id))

    s: set = set()
    for c in goalkeeper.categories:
        for t in c.trainers:
            _id = str(t.id)
            s.add(_id)

            p = redis_db.pipeline()
            p.multi()

            p.sadd(key, _id)
            p.expire(key, os.getenv('REDIS_CACHE_TTL'))
            p.execute()
    return str(user.id) in s


def get_match_performances(goalkeeper_id: str):
    '''Get the match performances of the goalkeeper'''
    goalkeeper = get_by_id(goalkeeper_id)
    return goalkeeper.match_performances


def remove_match_performance(goalkeeper_id: str,
                             match_performance: match_monitoring):
    '''Remove a specific match performance'''
    goalkeeper = get_by_id(goalkeeper_id)
    goalkeeper.match_performances.remove(match_performance)
    db.session.commit()


def get_training_performances(goalkeeper_id: str):
    '''Get the training performances of the goalkeeper'''
    goalkeeper = get_by_id(goalkeeper_id)
    return goalkeeper.training_performances


def remove_training_performance(goalkeeper_id: str,
                                training_performance: training_monitoring):
    '''Remove a specific training performance'''
    goalkeeper = get_by_id(goalkeeper_id)
    goalkeeper.training_performances.remove(training_performance)
    db.session.commit()
