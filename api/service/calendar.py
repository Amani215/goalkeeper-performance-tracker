'''Calendar services (add, update, etc.)'''
from sqlalchemy.exc import SQLAlchemyError
from config import db
from model.calendar import Calendar
import service.category as category_service


def add_calendar(calendar_type: str, journey: int, local: str, visitor: str,
                 category_id: str):
    '''Add a new calendar to the database'''
    category = category_service.get_by_id(category_id)

    calendar = Calendar(calendar_type, journey, local, visitor, category)

    db.session.add(calendar)
    db.session.commit()

    return calendar


def get_by_id(id):
    '''Get planning by ID'''
    try:
        calendar: Calendar = Calendar.query.filter_by(id=id).one()
        return calendar
    except SQLAlchemyError as err:
        return {'error': str(err)}


def delete(calendar_id: str):
    '''Delete a calendar given its ID'''
    calendar = get_by_id(calendar_id)

    db.session.delete(calendar)
    db.session.commit()
