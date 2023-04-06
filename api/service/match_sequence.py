'''Match sequence services'''
from sqlalchemy.exc import SQLAlchemyError
from config import db
from model.match_sequence import match_sequence
from model.user import User
from service.match_monitoring import get_by_id as get_performance_by_id, editable as editable_performance


def add_match_sequence(match_performance_id: str):
    '''Add a match sequence'''
    match_performance = get_performance_by_id(match_performance_id)
    new_match_sequence = match_sequence(match_performance)

    db.session.add(new_match_sequence)
    db.session.commit()

    return new_match_sequence


def get_by_id(id: str):
    '''Get match sequence by ID'''
    try:
        ms: match_sequence = match_sequence.query.filter_by(id=id).one()
        return ms
    except SQLAlchemyError as err:
        return {'error': str(err)}


def update_param(match_sequence_id: str, param_name: str, param_value):
    '''Set the param to the given value'''
    ms = get_by_id(match_sequence_id)

    ms.__setattr__(param_name, param_value)

    db.session.commit()
    return ms


def editable(ms: match_sequence, user: User) -> bool:
    '''Checks if the user is allowed to edit the given match sequence data'''
    if user.admin or editable_performance(ms.match_performance, user):
        return True
    return False


def delete(id: str):
    '''Deletes the given match sequence from the database'''
    ms = get_by_id(id)

    db.session.delete(ms)
    db.session.commit()
