'''Testing the training monitoring endpoints'''
import io
import json
import random
import uuid
import pytest

from helper import random_string, random_date
from tests.conftest import content_type
import service.category as category_service
import service.goalkeeper as goalkeeper_service
import service.user as user_service

URL_PREFIX = '/api'
URL = URL_PREFIX + '/training_monitoring'
ID_URL = URL_PREFIX + '/training_monitoring?id='
IMAGE_URL = 'tests/assets/image.jpeg'


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET TRAINING MONITORINGS ROUTE
    assert client.get(URL, headers=headers).status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_training_monitorings(client, json_headers):
    '''Test getting training monitoring routes'''
    response = client.get(URL, headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 0
    assert response.status_code == 200

    ### GET BY ID
    date = random_date.generate()
    test_json = {
        'name': random_string.generate(12),
        'day': date.day,
        'month': date.month,
        'year': date.year
    }
    goalkeeper = client.post(URL_PREFIX + '/goalkeeper',
                             data=json.dumps(test_json),
                             headers=json_headers)

    category_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category = category_service.add_category(category_json['name'],
                                             category_json['season'])

    date = random_date.generate_with_time()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category_id': category.id
    }
    training_session = client.post(URL_PREFIX + '/training_session',
                                   data=json.dumps(test_json),
                                   headers=json_headers)

    test_json = {
        'goalkeeper_id': goalkeeper.json['id'],
        'session_id': training_session.json['id']
    }
    training_monitoring = client.post(URL,
                                      data=json.dumps(test_json),
                                      headers=json_headers)

    response = client.get(ID_URL + training_monitoring.json['id'],
                          headers=json_headers)
    assert response.status_code == 200
    assert response.json['id'] == training_monitoring.json['id']

    response = client.get(ID_URL + str(uuid.uuid4), headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_training_monitoring(client, json_headers, goalkeeper,
                                 training_session):
    '''Test add a training monitoring object'''
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    test_json = {
        'goalkeeper_id': str(_goalkeeper.id),
        'session_id': str(training_session.id)
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 201
    assert 'id' in response.json

    ### BAD JSON
    test_json = {}
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param_diff_category(client, json_headers, training_monitoring):
    '''Test setting a param to a training monitoring object when user has no permissions'''
    test_data = {'attendance': random_string.generate(100)}
    response = client.put(ID_URL + str(training_monitoring.id),
                          data=json.dumps(test_data),
                          headers=json_headers)

    assert response.status_code == 401
    assert 'User cannot edit this data.' in response.json['error']


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param_session_category(client, authenticated_user,
                                    training_monitoring):
    '''Test setting a param to a training monitoring object when user has session's category'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    authenticated_user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(
        authenticated_user,
        training_monitoring.session.training_session_category)

    test_data = {'attendance': random_string.generate(100)}
    response = client.put(ID_URL + str(training_monitoring.id),
                          data=json.dumps(test_data),
                          headers=headers)

    assert response.status_code == 201
    assert response.json['attendance'] == test_data['attendance']


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param_goalkeeper_category(client, authenticated_user,
                                       training_monitoring):
    '''Test setting a param to a training monitoring object when user has goalkeeper's category'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    authenticated_user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(authenticated_user,
                              training_monitoring.goalkeeper.categories[0])

    # VALID
    test_data = {
        'attendance': random_string.generate(100),
        'attendance_time': random.randint(0, 200)
    }
    response = client.put(ID_URL + str(training_monitoring.id),
                          data=json.dumps(test_data),
                          headers=headers)

    assert response.status_code == 201
    assert response.json['attendance'] == test_data['attendance']
    assert response.json['attendance_time'] == test_data['attendance_time']
