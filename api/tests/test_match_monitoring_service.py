'''Testing the match monitoring services'''
import random
import service.match_monitoring as match_monitoring_service
import service.goalkeeper as goalkeeper_service
from helper import random_string


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


def test_update_params(app, match, goalkeeper):
    '''Test set the category of the match'''
    # Create match monitoring object
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    match_monitoring_obj = match_monitoring_service.add_match_monitoring(
        _goalkeeper.id, match.id)

    rand = random.randint(0, 100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "time_played", rand)
    assert response.time_played == rand

    rand = random.randint(0, 100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "goals_scored", rand)
    assert response.goals_scored == rand

    rand = random.randint(0, 100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "goals_conceded", rand)
    assert response.goals_conceded == rand

    rand = random.randint(0, 100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "penalties_saved", rand)
    assert response.penalties_saved == rand

    rand = random.randint(0, 100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "penalties_non_saved",
                                                     rand)
    assert response.penalties_non_saved == rand

    rand = random.randint(0, 100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "yellow_cards", rand)
    assert response.yellow_cards == rand

    rand = random.randint(0, 100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "red_cards", rand)
    assert response.red_cards == rand

    rand = random.randint(0, 100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "grade", rand)
    assert response.grade == rand

    rand = random_string.generate(100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "assets", rand)
    assert response.assets == rand

    rand = random_string.generate(100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "flaws", rand)
    assert response.flaws == rand

    rand = random_string.generate(100)
    response = match_monitoring_service.update_param(match_monitoring_obj.id,
                                                     "comment", rand)
    assert response.comment == rand
