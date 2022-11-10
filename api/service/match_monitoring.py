'''Match monitoring services (add, update, etc.)'''
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from config.postgres import db
from model.category import Category
from model.match_monitoring import match_monitoring
import service.goalkeeper as goalkeeper_service
import service.match as match_service


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


def update_time_played(match_monitoring_id: str, time_played: int):
    '''Set the time played of the goalkeeper'''
    match_monitoring_obj = get_by_id(match_monitoring_id)
    match_monitoring_obj.time_played = time_played

    db.session.commit()
    return match_monitoring_obj


def update_goals_scored(match_monitoring_id: str, goals_scored: int):
    '''Set the substitute of the goalkeeper'''
    match_monitoring_obj = get_by_id(match_monitoring_id)

    match_monitoring_obj.goals_scored = goals_scored

    db.session.commit()
    return match_monitoring_obj


def update_goals_conceded(match_monitoring_id: str, goals_conceded: int):
    '''Set the substitute of the goalkeeper'''
    match_monitoring_obj = get_by_id(match_monitoring_id)

    match_monitoring_obj.goals_conceded = goals_conceded

    db.session.commit()
    return match_monitoring_obj


def update_penalties_saved(match_monitoring_id: str, penalties_saved: int):
    '''Set the substitute of the goalkeeper'''
    match_monitoring_obj = get_by_id(match_monitoring_id)

    match_monitoring_obj.penalties_saved = penalties_saved

    db.session.commit()
    return match_monitoring_obj


def update_penalties_non_saved(match_monitoring_id: str,
                               penalties_non_saved: int):
    '''Set the substitute of the goalkeeper'''
    match_monitoring_obj = get_by_id(match_monitoring_id)

    match_monitoring_obj.penalties_non_saved = penalties_non_saved

    db.session.commit()
    return match_monitoring_obj