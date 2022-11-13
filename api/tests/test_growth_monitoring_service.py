'''Testing the match monitoring services'''
import pytest
import random
import service.growth_monitoring as growth_monitoring_service
import service.goalkeeper as goalkeeper_service
from helper import random_date


def test_add_growth_monitoring(app, goalkeeper):
    ''' Test adding growth monitoring'''

    growth_monitorings = growth_monitoring_service.get_growth_monitorings()
    growth_monitoring_count = len([i.serialize for i in growth_monitorings])

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    date = random_date.generate_with_time()
    growth_monitoring_service.add_growth_monitoring(_goalkeeper.id,
                                                    date.strftime('%d/%m/%Y'))

    growth_monitorings = growth_monitoring_service.get_growth_monitorings()
    assert len([i.serialize
                for i in growth_monitorings]) == growth_monitoring_count + 1
    # DUPLICATE
    with pytest.raises(Exception):
        growth_monitoring_service.add_growth_monitoring(
            _goalkeeper.id, date.strftime('%d/%m/%Y'))


def test_get_growth_monitorings(app):
    ''' Test getting all the growth monitorings in the database'''

    growth_monitorings = growth_monitoring_service.get_growth_monitorings()
    assert len([i.serialize for i in growth_monitorings]) == 0


def test_update_params(app, goalkeeper):
    '''Test set the category of the match'''
    # Create match monitoring object
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    date = random_date.generate_with_time()
    growth_monitoring_obj = growth_monitoring_service.add_growth_monitoring(
        _goalkeeper.id, date.strftime('%d/%m/%Y'))

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
