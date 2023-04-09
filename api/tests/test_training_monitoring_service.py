'''Testing the training monitoring services'''
import pytest
import service.training_monitoring as training_monitoring_service
import service.goalkeeper as goalkeeper_service
from helper import random_string
from random import randint


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


def test_update_attendance(app, training_session, goalkeeper):
    '''Test updating the attendance'''
    # Create training monitoring object
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    training_monitoring_obj = training_monitoring_service.add_training_monitoring(
        _goalkeeper.id, training_session.id)

    attendance = random_string.generate(100)
    response = training_monitoring_service.update_attendance(
        training_monitoring_obj.id, attendance)
    assert response.attendance == attendance

    # Test if attendance is absent
    attendance = 'absent'
    response = training_monitoring_service.update_attendance(
        training_monitoring_obj.id, attendance)
    assert response.attendance_time == 0


def test_update_attendance_time(app, training_session, goalkeeper):
    '''Test updating the comment'''
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    training_monitoring_obj = training_monitoring_service.add_training_monitoring(
        _goalkeeper.id, training_session.id)

    attendance_time = randint(0, 120)
    response = training_monitoring_service.update_attendance_time(
        training_monitoring_obj.id, attendance_time)
    assert response.attendance_time == attendance_time