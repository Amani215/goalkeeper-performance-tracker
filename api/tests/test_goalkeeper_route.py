'''Testing the goalkeeper endpoints'''
import io
import json
import random
import uuid
import pytest

from helper import random_string, random_date
from tests.conftest import content_type
import service.category as category_service

URL = '/goalkeeper'
PICTURE_URL = '/goalkeeper/picture'
CATEGORY_URL = '/goalkeeper/category'
NAME_URL = '/goalkeeper?name='


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET GOALKEEPERS ROUTE
    assert client.get(URL, headers=headers).status_code == 401

    ### ADD IMAGE ROUTE
    test_data = {
        'picture': (io.BytesIO(b'test_picture'), 'tests/assets/image.jpeg'),
    }
    response = client.put(PICTURE_URL, data=test_data, headers=headers)
    assert response.status_code == 401


@pytest.mark.parametrize(['admin'], [[False]])
def test_get_goalkeepers(client, authenticated_user, goalkeeper):
    '''Test getting goalkeeper routes'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    response = client.get(URL, headers=headers)
    assert sum(1 for _ in range(len(response.json))) == 1
    assert response.status_code == 200

    ### GET BY USERNAME
    response = client.get(NAME_URL + goalkeeper['name'], headers=headers)
    assert response.status_code == 200
    assert response.json['name'] == goalkeeper['name']

    response = client.get(NAME_URL + random_string.generate(4),
                          headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### GET BY ID
    id_url = URL + '?id='

    _goalkeeper = client.get(NAME_URL + goalkeeper['name'], headers=headers)
    response = client.get(id_url + _goalkeeper.json['id'], headers=headers)
    assert response.status_code == 200
    assert response.json['id'] == _goalkeeper.json['id']

    response = client.get(id_url + str(uuid.uuid4), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_goalkeeper(client, authenticated_user):
    '''Test add a goalkeeper'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    date = random_date.generate()
    test_json = {
        'name': random_string.generate(12),
        'day': date.day,
        'month': date.month,
        'year': date.year
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 201
    assert 'id' in response.json

    ### DUPLICATE NAME
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### BAD JSON
    test_json = {}
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}

    date = random_date.generate()
    test_json = {
        'username': random_string.generate(4),
        'day': date.day,
        'month': date.month,
        'year': date.year
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'name': random_string.generate(4),
        'birth day': date.day,
        'month': date.month,
        'year': date.year
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'username': random_string.generate(4),
        'day': date.day,
        'birth month': date.month,
        'year': date.year
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'username': random_string.generate(4),
        'day': date.day,
        'month': date.month,
        'birth year': date.year
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### MIN - MAX FIELDS


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_remove_category(client, authenticated_user, goalkeeper):
    '''Test adding and removing a category to a goalkeeper'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    test_category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category_service.add_category(test_category['name'],
                                  test_category['season'])
    response = client.get(NAME_URL + goalkeeper['name'], headers=headers)

    test_data = {
        'goalkeeper_id': response.json['id'],
        'category_id': test_category['name'] + str(test_category['season'])
    }
    response = client.put(CATEGORY_URL,
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 201

    ### DELETE
    response = client.delete(CATEGORY_URL,
                             data=json.dumps(test_data),
                             headers=headers)
    assert response.status_code == 204


@pytest.mark.parametrize(['admin'], [[False]])
def test_add_picture(client, authenticated_user, goalkeeper):
    '''Test adding a picture to the given goalkeeper route'''
    headers = {'Accept': '*/*', 'Authorization': authenticated_user['token']}
    response = client.get(NAME_URL + goalkeeper['name'], headers=headers)
    url = PICTURE_URL + '?id=' + response.json['id']

    test_data = {
        'picture': (io.BytesIO(b'test_picture'), 'tests/assets/image.jpeg'),
    }
    response = client.put(url, data=test_data, headers=headers)
    assert response.status_code == 200
    assert 'url' in response.json

    response = client.put(url, data={}, headers=headers)
    assert response.status_code == 400
    assert 'No data was provided' in response.json['error']