'''Testing the match monitoring endpoints'''
import json
import random
import uuid
import pytest

from helper import random_string, random_date
from tests.conftest import content_type
import service.goalkeeper as goalkeeper_service
import service.user as user_service

URL = '/match_monitoring'
ID_URL = '/match_monitoring?id='


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET GOALKEEPERS ROUTE
    assert client.get(URL, headers=headers).status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_matches(client, json_headers, category):
    '''Test getting match monitoring routes'''
    category_id = category.id
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
    goalkeeper = client.post('/goalkeeper',
                             data=json.dumps(test_json),
                             headers=json_headers)

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4),
        'category_id': category_id
    }
    match = client.post('/match',
                        data=json.dumps(test_json),
                        headers=json_headers)
    test_json = {
        'goalkeeper_id': goalkeeper.json['id'],
        'match_id': match.json['id']
    }
    match_monitoring = client.post(URL,
                                   data=json.dumps(test_json),
                                   headers=json_headers)

    response = client.get(ID_URL + match_monitoring.json['id'],
                          headers=json_headers)
    assert response.status_code == 200
    assert response.json['id'] == match_monitoring.json['id']

    response = client.get(ID_URL + str(uuid.uuid4), headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_match_monitoring(client, json_headers, goalkeeper, match):
    '''Test add a match monitoring object'''
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    test_json = {
        'goalkeeper_id': str(_goalkeeper.id),
        'match_id': str(match.id)
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
def test_set_param_diff_category(client, json_headers, match_monitoring):
    '''Test setting a param to a match monitoring object when the user has no permission'''
    rand_int = random.randint(0, 5)
    rand_string = random_string.generate(100)
    test_data = {'yellow_cards': rand_int, 'assets': rand_string}
    response = client.put(ID_URL + str(match_monitoring.id),
                          data=json.dumps(test_data),
                          headers=json_headers)
    assert response.status_code == 401
    assert 'User cannot edit this data.' in response.json['error']


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param_match_category(client, authenticated_user,
                                  match_monitoring):
    '''Test setting a param to a match monitoring object when user has the category of the match'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    authenticated_user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(authenticated_user,
                              match_monitoring.match.match_category)

    rand_int = random.randint(0, 5)
    rand_string = random_string.generate(100)
    test_data = {'yellow_cards': rand_int, 'assets': rand_string}
    response = client.put(ID_URL + str(match_monitoring.id),
                          data=json.dumps(test_data),
                          headers=headers)

    assert response.status_code == 201


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param_goalkeeper_category(client, authenticated_user,
                                       match_monitoring):
    '''Test setting a param to a match monitoring object when user has the category of the match'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    authenticated_user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(authenticated_user,
                              match_monitoring.main_goalkeeper.categories[0])

    rand_int = random.randint(0, 5)
    rand_string = random_string.generate(100)
    test_data = {'yellow_cards': rand_int, 'assets': rand_string}
    response = client.put(ID_URL + str(match_monitoring.id),
                          data=json.dumps(test_data),
                          headers=headers)

    assert response.status_code == 201