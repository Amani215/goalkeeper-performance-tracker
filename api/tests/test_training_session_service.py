'''Testing the match services'''
import random

import pytest
import service.training_session as training_session_service
import service.category as category_service
import service.goalkeeper as goalkeeper_service
import service.training_monitoring as training_monitoring_service
from helper import random_string, random_date


def test_add_training_session(app, category):
    ''' Test adding training session '''

    training_sessions = training_session_service.get_training_sessions()
    training_session_count = len([i.serialize for i in training_sessions])
    date = random_date.generate_with_time()
    training_session = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category_id': category.id
    }
    training_session_service.add_training_session(
        training_session['date'], training_session['duration'],
        training_session['category_id'])

    training_sessions = training_session_service.get_training_sessions()
    assert len([i.serialize
                for i in training_sessions]) == training_session_count + 1


def test_get_training_sessions(app):
    ''' Test getting training sessions from the database'''

    training_sessions = training_session_service.get_training_sessions()
    assert len([i.serialize for i in training_sessions]) == 0

    ## TRAINING SESSION 1
    category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category1 = category_service.add_category(category['name'],
                                              category['season'])
    date = random_date.generate_with_time()
    training_session = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category_id': category1.id
    }
    training_session1 = training_session_service.add_training_session(
        training_session['date'], training_session['duration'],
        training_session['category_id'])

    ## TRAINING SESSION 2
    category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category2 = category_service.add_category(category['name'],
                                              category['season'])
    date = random_date.generate_with_time()
    training_session = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category_id': category2.id
    }
    training_session2 = training_session_service.add_training_session(
        training_session['date'], training_session['duration'],
        training_session['category_id'])

    # GET BY ID
    response = training_session_service.get_by_id(training_session1.id)
    assert response.id == training_session1.id

    # GET BY CATEGORY
    response = training_session_service.get_by_category(category2.id)
    assert len([i.serialize for i in response]) == 1
    assert response[0].id == training_session2.id


def test_update_category(app, category):
    '''Test update the category of the training session'''
    new_category_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    new_category = category_service.add_category(new_category_json['name'],
                                                 new_category_json['season'])
    date = random_date.generate_with_time()
    training_session_json = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category_id': category.id
    }
    training_session = training_session_service.add_training_session(
        training_session_json['date'], training_session_json['duration'],
        training_session_json['category_id'])
    assert training_session.training_session_category_id == category.id

    training_session = training_session_service.update_category(
        training_session.id, new_category.id)
    assert training_session.training_session_category_id == new_category.id


def test_delete(app, training_session):
    '''Test deleting a training session'''
    training_id = training_session.id

    training_session_service.delete(training_id)

    assert training_session_service.get_by_id(
        training_id)["error"] == "No row was found when one was required"


def test_delete_with_relationship(app, goalkeeper, training_session):
    '''Test deleting with match related to goalkeeper'''
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])

    training_monitoring_service.add_training_monitoring(
        _goalkeeper.id, training_session.id)

    with pytest.raises(PermissionError):
        training_session_service.delete(training_session.id)
