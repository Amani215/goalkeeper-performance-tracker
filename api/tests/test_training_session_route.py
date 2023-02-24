'''Testing the training session endpoints'''
import json
import random
import uuid
import pytest

from helper import random_string, random_date
from tests.conftest import content_type
import service.category as category_service

URL = '/training_session'
CATEGORY_URL = '/training_session/category'
ID_URL = '/training_session?id='


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
    category = client.post('/category',
                           data=json.dumps(category_json),
                           headers=json_headers)

    date = random_date.generate_with_time()
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
    assert response.json == {'error': 'No data was provided'}

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
    date = random_date.generate_with_time()
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
    response = client.put(CATEGORY_URL,
                          data=json.dumps(test_data),
                          headers=json_headers)
    assert response.status_code == 201

    response = client.get(CATEGORY_URL + "?id=" +
                          training_session_obj.json['id'],
                          headers=json_headers)
    assert response.json['id'] == category['name'] + str(category['season'])
