'''Calendar services (add, update, etc.)'''
from sqlalchemy.exc import SQLAlchemyError
from config import db
from model.calendar import Calendar
from model.calendar_item import CalendarItem
import service.category as category_service


# CALENDARS
def add_calendar(calendar_type: str, category_id: str):
    '''Add a new calendar to the database'''
    category = category_service.get_by_id(category_id)

    calendar = Calendar(calendar_type, category)

    db.session.add(calendar)
    db.session.commit()

    return calendar


def get_calendar_by_id(id):
    '''Get calendar by ID'''
    try:
        calendar: Calendar = Calendar.query.filter_by(id=id).one()
        return calendar
    except SQLAlchemyError as err:
        return {'error': str(err)}


def delete_calendar(calendar_id: str):
    '''Delete a calendar given its ID'''
    calendar = get_calendar_by_id(calendar_id)

    db.session.delete(calendar)
    db.session.commit()


# CALENDAR ITEMS
def add_calendar_item(
    calendar_id,
    journey: int,
    local: str,
    visitor: str,
):
    '''Add item to calendar'''
    calendar = get_calendar_by_id(calendar_id)

    item = CalendarItem(journey, local, visitor, calendar)

    db.session.add(item)
    db.session.commit()

    return calendar


def get_item_by_id(id):
    '''Get calendar item by ID'''
    try:
        item: CalendarItem = CalendarItem.query.filter_by(id=id).one()
        return item
    except SQLAlchemyError as err:
        return {'error': str(err)}


def delete_item(item_id: str):
    '''Delete a calendar item'''
    calendar = get_item_by_id(item_id)

    db.session.delete(calendar)
    db.session.commit()
