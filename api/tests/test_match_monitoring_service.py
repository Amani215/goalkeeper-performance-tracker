'''Testing the match monitoring services'''
import service.match_monitoring as match_monitoring_service
import service.goalkeeper as goalkeeper_service
from helper import random_string, random_date


def test_add_match_monitoring(app, goalkeeper, match):
    ''' Test adding match monitoring'''

    match_monitorings = match_monitoring_service.get_match_monitorings()
    match_monitoring_count = len([i.serialize for i in match_monitorings])

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    match_monitoring_service.add_match_monitoring(_goalkeeper.id, match.id)

    match_monitorings = match_monitoring_service.get_match_monitorings()
    assert len([i.serialize
                for i in match_monitorings]) == match_monitoring_count + 1


def test_get_matches(app):
    ''' Test getting all the matches in the database'''

    match_monitorings = match_monitoring_service.get_match_monitorings()
    assert len([i.serialize for i in match_monitorings]) == 0


def test_set_penalties_non_saved(app, match, goalkeeper):
    '''Test set the category of the match'''
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    match_monitoring_obj = match_monitoring_service.add_match_monitoring(
        _goalkeeper.id, match.id)

    response = match_monitoring_service.update_penalties_non_saved(
        match_monitoring_obj.id, 3)

    assert response.penalties_non_saved == 3
