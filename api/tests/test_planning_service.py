'''Testing the Planning services'''
import service.planning as planning_service
from helper import random_date, random_string


def test_add_planning(app, category):
    '''Test adding a planning for an existing category'''
    plannings = category.plannings
    planning_count = len([i.serialize for i in plannings])

    date = random_date.generate()
    planning_service.add_planning(category.id, date.strftime('%d/%m/%Y'),
                                  random_string.generate(4))

    plannings = category.plannings
    assert len([i.serialize for i in plannings]) == planning_count + 1


def test_get_by_id(app, planning):
    '''Test get a planning by its ID'''
    _planning = planning_service.get_by_id(planning.id)
    assert _planning.id == planning.id

    # Bad ID
    _planning = planning_service.get_by_id(random_string.generate(7))
    assert 'error' in _planning


def test_set_date(app, planning):
    '''Test setting a new date for the planning'''
    new_date = random_date.generate().strftime('%d/%m/%Y')
    planning_service.set_date(planning.id, new_date)

    _planning = planning_service.get_by_id(planning.id)
    assert _planning.date.strftime('%d/%m/%Y') == new_date


def test_update_param(app, planning):
    '''Test updating random parameters of a planning object'''
    new_tactics = random_string.generate(5)
    planning_service.update_param(planning.id, 'tactics', new_tactics)
    _planning = planning_service.get_by_id(planning.id)
    assert _planning.tactics == new_tactics

    # Bad name
    new_observation = random_string.generate(5)
    planning_service.update_param(planning.id, 'Observation', new_observation)
    _planning = planning_service.get_by_id(planning.id)
    assert _planning.observation != new_observation

    planning_service.update_param(planning.id, 'observation', new_observation)
    _planning = planning_service.get_by_id(planning.id)
    assert _planning.observation == new_observation


def test_delete(app, planning):
    '''Test deleting a training session'''
    planning_id = planning.id
    planning_service.delete(planning_id)

    assert planning_service.get_by_id(
        planning_id)["error"] == "No row was found when one was required"
