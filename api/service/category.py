'''Category services (add, update, etc.)'''
from sqlalchemy.exc import SQLAlchemyError
from config import db
from model.category import Category


def add_category(name: str, season: str):
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


def get_category_trainers(category_id):
    '''Get coaches that have that category'''
    try:
        category: Category = Category.query.filter_by(id=category_id).one()
        return category.trainers
    except SQLAlchemyError as err:
        return {'error': str(err)}


def get_category_goalkeepers(category_id):
    '''Get goalkeepers that have that category'''
    try:
        category: Category = Category.query.filter_by(id=category_id).one()
        return category.goalkeepers
    except SQLAlchemyError as err:
        return {'error': str(err)}


def set_archived(category_id: str, archived: bool):
    '''Set archived to the given value'''
    try:
        category: Category = Category.query.filter_by(id=category_id).one()
        category.archived = archived

        db.session.commit()

        return category
    except SQLAlchemyError as err:
        return {'error': str(err)}


def delete(category_id):
    '''Delete a ctegory given its ID'''
    category = get_by_id(category_id)

    if (len([i for i in category.goalkeepers]) > 0
            or len([i for i in category.trainers]) > 0
            or len([i for i in category.training_sessions]) > 0
            or len([i for i in category.matches]) > 0):
        raise PermissionError("This category is connected to other entities")
    else:
        db.session.delete(category)
        db.session.commit()
