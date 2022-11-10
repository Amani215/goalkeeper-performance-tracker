'''Testing the training monitoring services'''
import pytest
import service.training_monitoring as training_monitoring_service
import service.goalkeeper as goalkeeper_service
from helper import random_string


def test_add_training_monitoring(app, goalkeeper, training_session):
    ''' Test adding training monitoring'''

    training_monitorings = training_monitoring_service.get_training_monitorings(
    )
    training_monitoring_count = len(
        [i.serialize for i in training_monitorings])

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    training_monitoring_service.add_training_monitoring(
        _goalkeeper.id, training_session.id)

    training_monitorings = training_monitoring_service.get_training_monitorings(
    )
    assert len([i.serialize for i in training_monitorings
                ]) == training_monitoring_count + 1
    # DUPLICATE
    with pytest.raises(Exception):
        training_monitoring_service.add_training_monitoring(
            _goalkeeper.id, training_session.id)


def test_get_training_monitorings(app):
    ''' Test getting all the training monitorings in the database'''

    training_monitorings = training_monitoring_service.get_training_monitorings(
    )
    assert len([i.serialize for i in training_monitorings]) == 0


def test_update_bool_params(app, training_session, goalkeeper):
    '''Test set boolean attributes of the training monitoring object'''
    # Create training monitoring object
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    training_monitoring_obj = training_monitoring_service.add_training_monitoring(
        _goalkeeper.id, training_session.id)

    response = training_monitoring_service.update_bool_param(
        training_monitoring_obj.id, "absent", True)
    assert response.absent == True

    response = training_monitoring_service.update_bool_param(
        training_monitoring_obj.id, "dismissed", True)
    assert response.dismissed == True

    response = training_monitoring_service.update_bool_param(
        training_monitoring_obj.id, "hurt", True)
    assert response.hurt == True

    response = training_monitoring_service.update_bool_param(
        training_monitoring_obj.id, "with_seniors", True)
    assert response.with_seniors == True

    response = training_monitoring_service.update_bool_param(
        training_monitoring_obj.id, "with_national_team", True)
    assert response.with_national_team == True


def test_update_comment(app, training_session, goalkeeper):
    '''Test updating the comment'''
    # Create training monitoring object
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    training_monitoring_obj = training_monitoring_service.add_training_monitoring(
        _goalkeeper.id, training_session.id)

    new_comment = random_string.generate(100)
    response = training_monitoring_service.update_comment(
        training_monitoring_obj.id, new_comment)
    assert response.comment == new_comment
