'''Testing the match endpoints'''
import json
import random
import uuid
import pytest

from helper import random_string, random_date
from tests.conftest import content_type
import service.category as category_service

URL = '/match'
CATEGORY_URL = '/match/category'
ID_URL = '/match?id='


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET GOALKEEPERS ROUTE
    assert client.get(URL, headers=headers).status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_matches(client, authenticated_user):
    '''Test getting match routes'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    response = client.get(URL, headers=headers)
    assert sum(1 for _ in range(len(response.json))) == 0
    assert response.status_code == 200

    ### GET BY ID
    date = random_date.generate(end='31/12/1999')
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    match = client.post(URL, data=json.dumps(test_json), headers=headers)

    response = client.get(ID_URL + match.json['id'], headers=headers)
    assert response.status_code == 200
    assert response.json['id'] == match.json['id']

    response = client.get(ID_URL + str(uuid.uuid4), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### GET BY DATE BEFORE
    date = random_date.generate(start='01/01/2000', end='01/01/2000')
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    client.post(URL, data=json.dumps(test_json), headers=headers)

    date = random_date.generate(start='02/01/2000')
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    client.post(URL, data=json.dumps(test_json), headers=headers)

    response = client.get(URL + '?before=01/01/2000', headers=headers)
    assert sum(1 for _ in range(len(response.json))) == 2

    ### GET BY DATE AFTER
    response = client.get(URL + '?after=02/01/2000', headers=headers)
    assert sum(1 for _ in range(len(response.json))) == 1


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_match(client, authenticated_user):
    '''Test add a match'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 201
    assert 'id' in response.json

    ### BAD JSON
    test_json = {}
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d-%m-%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local_team': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor_team': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'type': random_string.generate(4)
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_get_category(client, authenticated_user):
    '''Test setting a category to a match'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    match = client.post(URL, data=json.dumps(test_json), headers=headers)

    category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category_service.add_category(category['name'], category['season'])

    test_data = {
        'match_id': str(match.json['id']),
        'category_id': category['name'] + str(category['season'])
    }
    response = client.put(CATEGORY_URL,
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 201

    response = client.get(CATEGORY_URL + "?id=" + match.json['id'],
                          headers=headers)
    assert response.json['id'] == category['name'] + str(category['season'])
