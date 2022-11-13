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

URL = '/training_monitoring'
ID_URL = '/training_monitoring?id='
FORM_URL = '/training_monitoring/form?id='


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET TRAINING MONITORINGS ROUTE
    assert client.get(URL, headers=headers).status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_training_monitorings(client, authenticated_user):
    '''Test getting training monitoring routes'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    response = client.get(URL, headers=headers)
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
    goalkeeper = client.post('/goalkeeper',
                             data=json.dumps(test_json),
                             headers=headers)

    category_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category = category_service.add_category(category_json['name'],
                                             category_json['season'])

    date = random_date.generate_with_time()
    test_json = {
        'date': date.strftime('%d/%m/%Y %H:%M'),
        'duration': random.randint(0, 500),
        'category_id': category.id
    }
    training_session = client.post('/training_session',
                                   data=json.dumps(test_json),
                                   headers=headers)

    test_json = {
        'goalkeeper_id': goalkeeper.json['id'],
        'session_id': training_session.json['id']
    }
    training_monitoring = client.post(URL,
                                      data=json.dumps(test_json),
                                      headers=headers)

    response = client.get(ID_URL + training_monitoring.json['id'],
                          headers=headers)
    assert response.status_code == 200
    assert response.json['id'] == training_monitoring.json['id']

    response = client.get(ID_URL + str(uuid.uuid4), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_training_monitoring(client, authenticated_user, goalkeeper,
                                 training_session):
    '''Test add a training monitoring object'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    test_json = {
        'goalkeeper_id': str(_goalkeeper.id),
        'session_id': str(training_session.id)
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 201
    assert 'id' in response.json

    ### BAD JSON
    test_json = {}
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param_diff_category(client, authenticated_user,
                                 training_monitoring):
    '''Test setting a param to a training monitoring object when user has no permissions'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    assert training_monitoring.hurt == False
    assert training_monitoring.with_seniors == False

    comment = random_string.generate(100)
    test_data = {'hurt': True, 'with_seniors': True, 'comment': comment}
    response = client.put(ID_URL + str(training_monitoring.id),
                          data=json.dumps(test_data),
                          headers=headers)

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

    comment = random_string.generate(100)
    test_data = {'hurt': True, 'with_seniors': True, 'comment': comment}
    response = client.put(ID_URL + str(training_monitoring.id),
                          data=json.dumps(test_data),
                          headers=headers)

    assert response.status_code == 201
    assert response.json['hurt'] == True
    assert response.json['with_seniors'] == True
    assert response.json['comment'] == comment


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

    comment = random_string.generate(100)
    test_data = {'hurt': True, 'with_seniors': True, 'comment': comment}
    response = client.put(ID_URL + str(training_monitoring.id),
                          data=json.dumps(test_data),
                          headers=headers)

    assert response.status_code == 201
    assert response.json['hurt'] == True
    assert response.json['with_seniors'] == True
    assert response.json['comment'] == comment


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_form(client, authenticated_user, goalkeeper, training_session):
    '''Test adding a picture to the given goalkeeper route'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    test_json = {
        'goalkeeper_id': str(_goalkeeper.id),
        'session_id': str(training_session.id)
    }
    training_monitoring_obj = client.post(URL,
                                          data=json.dumps(test_json),
                                          headers=headers)

    headers = {'Accept': '*/*', 'Authorization': authenticated_user['token']}
    url = FORM_URL + training_monitoring_obj.json['id']

    test_data = {
        'training_form':
        (io.BytesIO(b'test_picture'), 'tests/assets/image.jpeg'),
    }
    response = client.put(url, data=test_data, headers=headers)

    assert response.status_code == 200
    assert 'url' in response.json

    response = client.put(url, data={}, headers=headers)
    assert response.status_code == 400
    assert 'No data was provided' in response.json['error']