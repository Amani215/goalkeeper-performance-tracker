'''Testing the match services'''
from random import randint
import pytest
from model.match import Match
import service.match as match_service
import service.match_monitoring as match_monitoring_service
import service.goalkeeper as goalkeeper_service
from helper import random_string, random_date

DATE_FORMAT = '%d/%m/%Y'


def test_add_match(app, category):
    ''' Test adding match '''

    matches = match_service.get_matches()
    match_count = len([i.serialize for i in matches])
    date = random_date.generate()
    match = {
        'date': date.strftime(DATE_FORMAT),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    match_service.add_match(match['date'], match['visitor'], match['local'],
                            match['match_type'], category.id)

    matches = match_service.get_matches()
    assert len([i.serialize for i in matches]) == match_count + 1


def test_get_matches(app):
    ''' Test getting all the matches in the database'''

    matches = match_service.get_matches()
    assert len([i.serialize for i in matches]) == 0


def test_get_by_date(app, category):
    '''Test get matches before or after a certain date'''
    date = random_date.generate(start='01/01/1970', end='31/12/1999')
    match = {
        'date': date.strftime(DATE_FORMAT),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    match_service.add_match(match['date'], match['visitor'], match['local'],
                            match['match_type'], category.id)

    date = random_date.generate(start='01/01/2000', end='01/01/2000')
    match = {
        'date': date.strftime(DATE_FORMAT),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    match_service.add_match(match['date'], match['visitor'], match['local'],
                            match['match_type'], category.id)

    date = random_date.generate(start='02/01/2000')
    match = {
        'date': date.strftime(DATE_FORMAT),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    match_service.add_match(match['date'], match['visitor'], match['local'],
                            match['match_type'], category.id)

    response = match_service.get_by_date_before('01/01/2000')
    assert len([i.serialize for i in response]) == 2

    response = match_service.get_by_date_after('02/01/2000')
    assert len([i.serialize for i in response]) == 1


def test_set_category(app, match, category):
    '''Test set the category of the match'''
    _match = match_service.get_by_id(match.id)
    response = match_service.set_category(_match, category)

    assert response['category_id'] == category.id


def test_set_teams(app, match):
    '''Test set teams of the match'''
    match_id = match.id

    # Set no teams
    response = match_service.set_teams(match=match)
    assert response.local == match.local
    assert response.visitor == match.visitor
    assert match.id == match_id

    # Set empty teams
    response = match_service.set_teams(match=match, local='', visitor='')
    assert response.local == match.local
    assert response.visitor == match.visitor
    assert match.id == match_id

    # Set local team only
    new_local = random_string.generate(3)
    response = match_service.set_teams(match=match, local=new_local)
    assert response.local == new_local
    assert match.id == match_id

    # Set visitor team only
    new_visitor = random_string.generate(3)
    response = match_service.set_teams(match=match, visitor=new_visitor)
    assert response.visitor == new_visitor
    assert match.id == match_id

    # Set both teams
    new_local = random_string.generate(3)
    new_visitor = random_string.generate(3)
    response = match_service.set_teams(match=match,
                                       local=new_local,
                                       visitor=new_visitor)
    assert response.visitor == new_visitor
    assert response.local == new_local
    assert match.id == match_id


def test_set_date(app, match):
    '''Test set the date of the match'''
    # Set no date
    response = match_service.set_date(match)
    assert response.date == match.date

    # Set empty date
    response = match_service.set_date(match, date='')
    assert response.date == match.date

    # Set invalid date
    with pytest.raises(Exception):
        date = random_date.generate()
        new_date = date.strftime('%d/%m/%Y %H:%M')
        match_service.set_date(match, new_date)

    # Set valid date
    date = random_date.generate()
    new_date = date.strftime(DATE_FORMAT)
    response = match_service.set_date(match, new_date)
    assert response.date.strftime(DATE_FORMAT) == new_date


def test_set_match_type(app, match):
    '''Test set teams of the match'''
    match_id = match.id

    # Set no match_type
    response = match_service.set_match_type(match=match)
    assert response.match_type == match.match_type
    assert match.id == match_id

    # Set empty match_type
    response = match_service.set_match_type(match=match, match_type='')
    assert response.match_type == match.match_type
    assert match.id == match_id

    # Set valid match_type
    new_match_type = random_string.generate(3)
    response = match_service.set_match_type(match=match,
                                            match_type=new_match_type)
    assert response.match_type == new_match_type
    assert match.id == match_id


def test_set_scores(app, match):
    ''''''
    match_id = match.id

    score_local = randint(0, 10)
    score_visitor = randint(0, 10)
    result = random_string.generate(5)

    response = match_service.set_scores(match_id, score_local, score_visitor,
                                        result)
    assert response.score_local == score_local
    assert response.score_visitor == score_visitor
    assert response.result == result


def test_remove_performance(app, match_monitoring):
    '''Test deleting a goalkeeper performance'''
    mm_id = match_monitoring.id
    match = match_service.get_by_id(match_monitoring.match_id)
    goalkeeper = goalkeeper_service.get_by_id(
        match_monitoring.main_goalkeeper_id)

    match_service.remove_goalkeeper_performance(match_monitoring.match.id,
                                                match_monitoring.id)

    assert match_monitoring not in match.goalkeepers_performances
    assert match_monitoring not in goalkeeper.match_performances
    assert match_monitoring_service.get_by_id(
        mm_id)['error'] == 'No row was found when one was required'


def test_delete(app, match):
    '''Test deleting a match'''
    match_id = match.id

    match_service.delete(match_id)

    assert match_service.get_by_id(
        match_id)["error"] == "No row was found when one was required"


def test_delete_with_relationship(app, goalkeeper, match):
    '''Test deleting with match related to goalkeeper'''
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])

    match_monitoring_service.add_match_monitoring(_goalkeeper.id, match.id)

    with pytest.raises(PermissionError):
        match_service.delete(match.id)
