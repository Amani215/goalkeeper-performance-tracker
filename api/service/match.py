'''Match services (add, update, etc.)'''
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from config.postgres import db
from model.category import Category
from model.match import Match


def add_match(date: str, local: str, visitor: str, match_type: str):
    '''Add a new match to the database'''
    match_date = datetime.strptime(date, '%d/%m/%Y')
    match = Match(match_date, local, visitor, match_type)

    db.session.add(match)
    db.session.commit()

    return match


def get_matches():
    '''Get all matches'''
    return Match.query.all()


def get_by_id(id):
    '''Get match by ID'''
    try:
        match: Match = Match.query.filter_by(id=id).one()
        return match
    except SQLAlchemyError as err:
        return {'error': str(err)}


def set_category(match: Match, category: Category):
    '''Set the category of the match'''
    match.match_category = category
    db.session.commit()
    return {'match_id': match.id, 'category_id': category.id}
