'''Testing the training session endpoints'''
import io
import json
import random
import uuid
import pytest

from helper import random_string, random_date
import service.category as category_service
import service.goalkeeper as goalkeeper_service

URL = '/training_session'
ID_URL = '/training_session?id='
SESSION_CATEGORY_URL = '/training_session/category'
PERFORMANCE_URL = '/training_session/performances?id='
FORM_URL = '/training_session/form?id='
IMAGE_URL = 'tests/assets/image.jpeg'
CATEGORY_URL = '/category'

NO_DATA = 'No data was provided'


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET GOALKEEPERS ROUTE
    assert client.get(URL, headers=headers).status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_training_sessions(client, json_headers):
    '''Test getting training session routes'''
    response = client.get(URL, headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 0
    assert response.status_code == 200

    ### GET BY ID
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
    training_session_obj = client.post(URL,
                                       data=json.dumps(test_json),
                                       headers=json_headers)

    response = client.get(ID_URL + training_session_obj.json['id'],
                          headers=json_headers)
    assert response.status_code == 200
    assert response.json['id'] == training_session_obj.json['id']

    # GET BY CATEGORY ID
    response = client.get('/training_session?category_id=' + category.id,
                          headers=json_headers)
    assert response.status_code == 200
    assert len(response.json) == 1

    # INVALID ID
    response = client.get(ID_URL + str(uuid.uuid4), headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_training_session(client, json_headers):
    '''Test add a training session'''
    category_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category = client.post(CATEGORY_URL,
                           data=json.dumps(category_json),
                           headers=json_headers)

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category_id': category.json['id']
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
    assert response.json == {'error': NO_DATA}

    date = random_date.generate_with_time()
    test_json = {
        'date': date.strftime('%d/%m/%Y %H:%M'),
        'duration': random.randint(0, 500),
        'category_id': category.json['id']
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate_with_time()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'time': random.randint(0, 500),
        'category_id': category.json['id']
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate_with_time()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category_id': random_string.generate(5)
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate_with_time()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category': category.json['id']
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_get_category(client, json_headers, category):
    '''Test setting and getting a category to a training session'''
    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category_id': category.id
    }
    training_session_obj = client.post(URL,
                                       data=json.dumps(test_json),
                                       headers=json_headers)

    category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category_service.add_category(category['name'], category['season'])

    test_data = {
        'training_session_id': str(training_session_obj.json['id']),
        'category_id': category['name'] + str(category['season'])
    }
    response = client.put(SESSION_CATEGORY_URL,
                          data=json.dumps(test_data),
                          headers=json_headers)
    assert response.status_code == 201

    response = client.get(SESSION_CATEGORY_URL + "?id=" +
                          training_session_obj.json['id'],
                          headers=json_headers)
    assert response.status_code == 200
    assert response.json['id'] == category['name'] + str(category['season'])

    # INVALID ID
    response = client.get(SESSION_CATEGORY_URL + "?id=" +
                          random_string.generate(8),
                          headers=json_headers)
    assert response.status_code == 400

    # EMPTY JSON
    test_data = {}
    response = client.put(SESSION_CATEGORY_URL,
                          data=json.dumps(test_data),
                          headers=json_headers)
    assert response.status_code == 400
    assert response.json['error'] == NO_DATA


@pytest.mark.parametrize(['admin'], [[False]])
def test_add_form_diff_category(client, authenticated_user, training_session):
    '''Test adding a form to the given training session route'''
    headers = {'Accept': '*/*', 'Authorization': authenticated_user['token']}
    url = FORM_URL + str(training_session.id)

    test_data = {
        'training_form': (io.BytesIO(b'test_picture'), IMAGE_URL),
    }
    response = client.put(url, data=test_data, headers=headers)

    assert response.status_code == 201

    ### BAD JSON
    response = client.put(url, data={}, headers=headers)
    assert response.status_code == 400
    assert NO_DATA in response.json['error']


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_goalkeepers(client, json_headers):
    '''Test get training session goalkeepers'''
    category_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category = client.post(CATEGORY_URL,
                           data=json.dumps(category_json),
                           headers=json_headers)

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category_id': category.json['id']
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)

    # GET GOALKEEPERS
    goalkeepers = client.get(PERFORMANCE_URL + response.json['id'],
                             headers=json_headers)
    assert goalkeepers.status_code == 200
    assert len(goalkeepers.json) == 0


@pytest.mark.parametrize(['admin'], [[True]])
def test_remove_goalkeepers(client, json_headers, goalkeeper):
    '''Test remove a goalkeeper'''
    category_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category = client.post(CATEGORY_URL,
                           data=json.dumps(category_json),
                           headers=json_headers)

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'duration': random.randint(0, 500),
        'category_id': category.json['id']
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)

    # Add goalkeeper
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    test_json = {
        'goalkeeper_id': _goalkeeper.id,
        'session_id': response.json['id']
    }
    tp = client.post('/training_monitoring',
                     data=json.dumps(test_json),
                     headers=json_headers)
    goalkeepers = client.get(PERFORMANCE_URL + response.json['id'],
                             headers=json_headers)
    assert goalkeepers.status_code == 200
    assert len(goalkeepers.json) == 1

    test_json = {'goalkeeper_performance_id': tp.json['id']}
    delete_response = client.delete(PERFORMANCE_URL + response.json['id'],
                                    data=json.dumps(test_json),
                                    headers=json_headers)
    assert delete_response.status_code == 204
    goalkeepers = client.get(PERFORMANCE_URL + response.json['id'],
                             headers=json_headers)
    assert goalkeepers.status_code == 200
    assert len(goalkeepers.json) == 0
