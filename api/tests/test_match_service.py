'''Testing the match services'''
from model.match import Match
import service.match as match_service
from helper import random_string, random_date


def test_add_match(app):
    ''' Test adding match '''

    matches = match_service.get_matches()
    match_count = len([i.serialize for i in matches])
    date = random_date.generate()
    match = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    match_service.add_match(match['date'], match['visitor'], match['local'],
                            match['match_type'])

    matches = match_service.get_matches()
    assert len([i.serialize for i in matches]) == match_count + 1


def test_get_matches(app):
    ''' Test getting all the matches in the database'''

    matches = match_service.get_matches()
    assert len([i.serialize for i in matches]) == 0


def test_set_category(app, match, category):
    '''Test set the category of the match'''
    _match = match_service.get_by_id(match.id)
    response = match_service.set_category(_match, category)

    assert response['category_id'] == category.id
