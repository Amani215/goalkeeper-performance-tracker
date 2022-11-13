'''Goalkeeper services (add, update, etc.)'''
import datetime
import os
from cgi import FieldStorage
from sqlalchemy.exc import SQLAlchemyError
from config.postgres import db
from model.category import Category
from model.goalkeeper import Goalkeeper
from model.user import User
from service.s3 import upload_file
from config.redis import redis_db


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
    goalkeeper.categories.append(category)
    db.session.commit()
    return {'goalkeeper_id': goalkeeper.id, 'category_id': category.id}


def remove_category(goalkeeper: Goalkeeper, category: Category):
    '''Remove a category from the goalkeeper's list'''
    key = f'{goalkeeper.id}_editable'
    redis_db.delete(key)
    goalkeeper.categories.remove(category)
    db.session.commit()


def update_picture(goalkeeper: Goalkeeper, pic: FieldStorage):
    '''Set or change the link to the profile pic of the user'''
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
            redis_db.sadd(key, _id)
    return str(user.id) in s
