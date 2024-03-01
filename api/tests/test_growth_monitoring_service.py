'''Testing the match monitoring services'''
import pytest
import random
from sqlalchemy.exc import SQLAlchemyError
import service.growth_monitoring as growth_monitoring_service
import service.goalkeeper as goalkeeper_service
from helper import random_date, random_string

DATE_FORMAT = '%d/%m/%Y'

def test_add_growth_monitoring(app, goalkeeper):
    ''' Test adding growth monitoring'''

    growth_monitorings = growth_monitoring_service.get_growth_monitorings()
    growth_monitoring_count = len([i.serialize for i in growth_monitorings])

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    date = random_date.generate_with_time()
    growth_monitoring_service.add_growth_monitoring(_goalkeeper.id,
                                                    date.strftime(DATE_FORMAT))

    growth_monitorings = growth_monitoring_service.get_growth_monitorings()
    assert len([i.serialize
                for i in growth_monitorings]) == growth_monitoring_count + 1
    # DUPLICATE
    with pytest.raises(Exception):
        growth_monitoring_service.add_growth_monitoring(
            _goalkeeper.id, date.strftime(DATE_FORMAT))


def test_get_growth_monitorings(app):
    ''' Test getting all the growth monitorings in the database'''

    growth_monitorings = growth_monitoring_service.get_growth_monitorings()
    assert len([i.serialize for i in growth_monitorings]) == 0


def test_get_by_id(app, growth):
    '''Test get growth monitoring object by ID'''
    growth_monitoring_obj = growth_monitoring_service.get_by_id(growth.id)
    assert growth_monitoring_obj.id == growth.id


def test_get_by_goalkeeper_id(app, growth):
    '''Test get growth monitoring object by goalkeeper ID'''
    growth_monitoring_obj = growth_monitoring_service.get_by_goalkeeper_id(
        growth.goalkeeper_id)
    assert len(growth_monitoring_obj) == 1


def test_update_params(app, goalkeeper):
    '''Test set the category of the match'''
    # Create match monitoring object
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    date = random_date.generate_with_time()
    growth_monitoring_obj = growth_monitoring_service.add_growth_monitoring(
        _goalkeeper.id, date.strftime(DATE_FORMAT))

    rand = random.randint(0, 100)
    response = growth_monitoring_service.update_param(growth_monitoring_obj.id,
                                                      "weight", rand)
    assert response.weight == rand

    rand = random.randint(0, 100)
    response = growth_monitoring_service.update_param(growth_monitoring_obj.id,
                                                      "height", rand)
    assert response.height == rand

    rand = random.randint(0, 100)
    response = growth_monitoring_service.update_param(growth_monitoring_obj.id,
                                                      "torso_height", rand)
    assert response.torso_height == rand

    rand = random.randint(0, 100)
    response = growth_monitoring_service.update_param(growth_monitoring_obj.id,
                                                      "thoracic_perimeter",
                                                      rand)
    assert response.thoracic_perimeter == rand

    rand = random.randint(0, 100)
    response = growth_monitoring_service.update_param(growth_monitoring_obj.id,
                                                      "annual_growth", rand)
    assert response.annual_growth == rand


def test_delete(app, growth):
    '''Test deleting a growth object'''
    growth_id = growth.id

    growth_monitoring_service.delete(growth_id)

    assert growth_monitoring_service.get_by_id(
        growth_id)["error"] == "No row was found when one was required"


def test_set_date(app, growth):
    '''Test setting the date for a growth monitoring object'''
    new_date = random_date.generate()
    growth_monitoring_service.set_date(growth, new_date.strftime(DATE_FORMAT))
    assert growth.date == new_date.date()
