'''Goalkeeper services (add, update, etc.)'''
import datetime
import os
from cgi import FieldStorage
from sqlalchemy.exc import SQLAlchemyError
from config.postgres import db
from model.category import Category
from model.goalkeeper import Goalkeeper
from service.s3 import upload_file


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


def add_category(goalkeeper: Goalkeeper, category: Category):
    '''Add a category to the goalkeeper'''
    goalkeeper.categories.append(category)
    db.session.commit()
    return {'goalkeeper_id': goalkeeper.id, 'category_id': category.id}


def remove_category(goalkeeper: Goalkeeper, category: Category):
    '''Remove a category from the goalkeeper's list'''
    goalkeeper.categories.remove(category)
    db.session.commit()


def update_profile_pic(goalkeeper: Goalkeeper, pic: FieldStorage):
    '''Set or change the link to the profile pic of the user'''
    pic_url = upload_file(pic, os.getenv('GOALKEEPER_PICS_BUCKET'))
    goalkeeper.picture = pic_url
    db.session.commit()
    return pic_url