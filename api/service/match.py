'''Match services (add, update, etc.)'''
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from config.postgres import db
from model.category import Category
from model.match import Match
from config.redis import redis_db


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


def get_by_date_before(date: str):
    '''Get matches with a date before the given date'''
    given_date = datetime.strptime(date, '%d/%m/%Y')
    return Match.query.filter(Match.date <= given_date)


def get_by_date_after(date: str):
    '''Get matches with a date after the given date'''
    given_date = datetime.strptime(date, '%d/%m/%Y')
    return Match.query.filter(Match.date >= given_date)


def set_category(match: Match, category: Category):
    '''Set the category of the match'''
    for gp in match.goalkeepers_performances:
        key = f'{gp.id}_editable'
        redis_db.delete(key)

    match.match_category = category
    db.session.commit()
    return {'match_id': match.id, 'category_id': category.id}


def set_scores(match_id: str, score_local: int = -1, score_visitor: int = -1):
    '''Set the scores. If score is not provided (i.e. it equals -1 then it is not changed.'''
    match = get_by_id(match_id)

    if (score_local > -1):
        match.score_local = score_local
    elif (score_local < -1):
        raise ValueError('Score cannot be negative.')

    if (score_visitor > -1):
        match.score_visitor = score_visitor
    elif (score_visitor < -1):
        raise ValueError('Score cannot be negative.')

    db.session.commit()
    return match


def get_goalkeepers_performances(match_id: str):
    '''Returns the match monitoring objects belonging to the given ID'''
    match = get_by_id(match_id)
    return match.goalkeepers_performances
