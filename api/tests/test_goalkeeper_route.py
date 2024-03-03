'''Testing the goalkeeper endpoints'''
import io
import json
import random
import uuid
import pytest

from helper import random_string, random_date
import service.category as category_service
import service.goalkeeper as goalkeeper_service
import service.user as user_service
from tests.conftest import content_type

URL_PREFIX = '/api'
URL = URL_PREFIX + '/goalkeeper'
ID_URL = URL_PREFIX + '/goalkeeper?id='
PICTURE_URL = URL_PREFIX + '/goalkeeper/picture'
CATEGORY_URL = URL_PREFIX + '/goalkeeper/category'
MATCH_URL = URL_PREFIX + '/goalkeeper/match_performances'
TRAINING_URL = URL_PREFIX + '/goalkeeper/training_performances'
NAME_URL = URL_PREFIX + '/goalkeeper?name='
PIC = URL_PREFIX + 'tests/assets/image.jpeg'


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET GOALKEEPERS ROUTE
    assert client.get(URL, headers=headers).status_code == 401

    ### ADD IMAGE ROUTE
    test_data = {
        'picture': (io.BytesIO(b'test_picture'), PIC),
    }
    response = client.put(PICTURE_URL, data=test_data, headers=headers)
    assert response.status_code == 401


@pytest.mark.parametrize(['admin'], [[False]])
def test_get_goalkeepers(client, json_headers, goalkeeper):
    '''Test getting goalkeeper routes'''
    response = client.get(URL, headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 1
    assert response.status_code == 200

    ### GET BY USERNAME
    response = client.get(NAME_URL + goalkeeper['name'], headers=json_headers)
    assert response.status_code == 200
    assert response.json['name'] == goalkeeper['name']

    response = client.get(NAME_URL + random_string.generate(4),
                          headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### GET BY ID
    id_url = URL + '?id='

    _goalkeeper = client.get(NAME_URL + goalkeeper['name'],
                             headers=json_headers)
    response = client.get(id_url + _goalkeeper.json['id'],
                          headers=json_headers)
    assert response.status_code == 200
    assert response.json['id'] == _goalkeeper.json['id']

    response = client.get(id_url + str(uuid.uuid4), headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_goalkeeper(client, json_headers):
    '''Test add a goalkeeper'''
    date = random_date.generate()
    test_json = {
        'name': random_string.generate(12),
        'day': date.day,
        'month': date.month,
        'year': date.year
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 201
    assert 'id' in response.json

    ### DUPLICATE NAME
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### BAD JSON
    test_json = {}
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}

    date = random_date.generate()
    test_json = {
        'username': random_string.generate(4),
        'day': date.day,
        'month': date.month,
        'year': date.year
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'name': random_string.generate(4),
        'birth day': date.day,
        'month': date.month,
        'year': date.year
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'username': random_string.generate(4),
        'day': date.day,
        'birth month': date.month,
        'year': date.year
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'username': random_string.generate(4),
        'day': date.day,
        'month': date.month,
        'birth year': date.year
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### MIN - MAX FIELDS


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_remove_category(client, json_headers, goalkeeper):
    '''Test adding and removing a category to a goalkeeper'''
    # NO JSON
    response = client.put(CATEGORY_URL, headers=json_headers)
    assert response.status_code == 400

    # VALID JSON
    test_category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category_service.add_category(test_category['name'],
                                  test_category['season'])
    _goalkeeper = client.get(NAME_URL + goalkeeper['name'],
                             headers=json_headers)

    test_data = {
        'goalkeeper_id': _goalkeeper.json['id'],
        'category_id': test_category['name'] + str(test_category['season'])
    }
    response = client.put(CATEGORY_URL,
                          data=json.dumps(test_data),
                          headers=json_headers)
    assert response.status_code == 201

    categories = client.get(CATEGORY_URL + '?id=' + _goalkeeper.json['id'],
                            headers=json_headers)
    assert categories.status_code == 200
    assert len(categories.json) == 1

    ### DELETE
    response = client.delete(CATEGORY_URL,
                             data=json.dumps(test_data),
                             headers=json_headers)
    assert response.status_code == 204


@pytest.mark.parametrize(['admin'], [[False]])
def test_add_picture(client, authenticated_user, goalkeeper, category):
    '''Test adding a picture to the given goalkeeper route'''
    ### ADD PIC AS USER FROM DIFFERENT CATEGORY
    headers = {'Accept': '*/*', 'Authorization': authenticated_user['token']}
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    goalkeeper_service.add_category(_goalkeeper, category)

    url = PICTURE_URL + '?id=' + str(_goalkeeper.id)
    test_data = {
        'picture': (io.BytesIO(b'test_picture'), PIC),
    }

    response = client.put(url, data=test_data, headers=headers)
    assert response.status_code == 401
    assert 'User cannot edit this goalkeeper.' in response.json['error']

    ### ADD EMPTY JSON
    response = client.put(url, data={}, headers=headers)
    assert response.status_code == 400
    assert 'No data was provided' in response.json['error']

    ### ADD PIC AS USER FROM SAME CATEGORY
    authenticated_user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(authenticated_user, category)

    test_data = {
        'picture': (io.BytesIO(b'test_picture'), PIC),
    }
    response = client.put(url, data=test_data, headers=headers)
    assert response.status_code == 200
    assert 'url' in response.json


@pytest.mark.parametrize(['admin'], [[False]])
def test_get_categories(client, goalkeeper, json_headers):
    '''Test getting the goalkeeper's categories'''
    _goalkeeper = client.get(NAME_URL + goalkeeper['name'],
                             headers=json_headers)
    categories = client.get(CATEGORY_URL + '?id=' + _goalkeeper.json['id'],
                            headers=json_headers)
    assert categories.status_code == 200
    assert len(categories.json) == 0

    categories = client.get(CATEGORY_URL, headers=json_headers)
    assert categories.status_code == 400


@pytest.mark.parametrize(['admin'], [[False]])
def test_get_match_performances(client, goalkeeper, json_headers):
    '''Test getting the goalkeeper's match performances'''
    _goalkeeper = client.get(NAME_URL + goalkeeper['name'],
                             headers=json_headers)
    matches = client.get(MATCH_URL + '?id=' + _goalkeeper.json['id'],
                         headers=json_headers)
    assert matches.status_code == 200
    assert len(matches.json) == 0

    # MISSING ID
    matches = client.get(MATCH_URL, headers=json_headers)
    assert matches.status_code == 400
    assert 'error' in matches.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_training_performances(client, goalkeeper, training_session,
                                   json_headers):
    '''Test getting the goalkeeper's training performances'''
    _goalkeeper = client.get(NAME_URL + goalkeeper['name'],
                             headers=json_headers)

    trainings = client.get(TRAINING_URL + '?id=' + _goalkeeper.json['id'],
                           headers=json_headers)
    assert trainings.status_code == 200
    assert len(trainings.json) == 0

    # MISSING ID
    trainings = client.get(TRAINING_URL, headers=json_headers)
    assert trainings.status_code == 400
    assert 'error' in trainings.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_param_match_category(client, authenticated_user, goalkeeper):
    '''Test setting a parameter'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])

    rand_int = random.randint(0, 90000)
    rand_date = random_date.generate()
    test_data = {
        'phone': str(rand_int),
        'birthday': str(rand_date.strftime('%d/%m/%Y'))
    }

    # NO ID
    response = client.put(URL, data=json.dumps(test_data), headers=headers)
    assert response.status_code == 400

    # VALID REQUEST
    response = client.put(ID_URL + str(_goalkeeper.id),
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 201


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param_different_category(client, authenticated_user, goalkeeper):
    '''Test setting a parameter'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])

    rand_int = random.randint(0, 90000)
    rand_date = random_date.generate()
    test_data = {
        'phone': str(rand_int),
        'birthday': str(rand_date.strftime('%d/%m/%Y'))
    }

    # VALID REQUEST
    response = client.put(ID_URL + str(_goalkeeper.id),
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 401
    assert 'User cannot edit this goalkeeper.' in response.json['error']
