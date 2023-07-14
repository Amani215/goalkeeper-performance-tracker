'''Testing the Calendar services'''
import service.calendar as calendar_service
from helper import random_date, random_string


def test_add_calendar(app, category):
    '''Test adding a calendar for an existing category'''
    calendars = category.calendars
    calendar_count = len([i.serialize for i in calendars])

    calendar_service.add_calendar(random_string.generate(4), 3,
                                  random_string.generate(4),
                                  random_string.generate(4), category.id)

    calendars = category.calendars
    assert len([i.serialize for i in calendars]) == calendar_count + 1


def test_get_by_id(app, calendar):
    '''Test get a calendar by its ID'''
    _calendar = calendar_service.get_by_id(calendar.id)
    assert _calendar.id == calendar.id

    # Bad ID
    _calendar = calendar_service.get_by_id(random_string.generate(7))
    assert 'error' in _calendar


def test_delete(app, calendar):
    '''Test deleting a calendar'''
    calendar_id = calendar.id
    calendar_service.delete(calendar_id)

    assert calendar_service.get_by_id(
        calendar_id)["error"] == "No row was found when one was required"
