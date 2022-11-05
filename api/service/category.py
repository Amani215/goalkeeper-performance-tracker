'''Category services (add, update, etc.)'''
from sqlalchemy.exc import SQLAlchemyError
from config.postgres import db
from model.category import Category


def add_category(name: str, season: int):
    '''Adds a new category to the database'''
    category = Category(name, season)

    db.session.add(category)
    db.session.commit()

    return category


def get_categories():
    '''Get all categories'''
    return Category.query.all()


def get_by_id(category_id):
    '''Get category by id'''
    try:
        category: Category = Category.query.filter_by(id=category_id).one()
        return category
    except SQLAlchemyError as err:
        return {'error': str(err)}


def get_by_name(category_name):
    '''Get categories with the same name from all seasons'''
    try:
        return Category.query.filter_by(name=category_name)
    except SQLAlchemyError as err:
        return {'error': str(err)}


def get_by_season(category_season):
    '''Get categories from the same season'''
    try:
        return Category.query.filter_by(season=category_season)
    except SQLAlchemyError as err:
        return {'error': str(err)}
