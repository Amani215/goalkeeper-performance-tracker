'''Test match sequences routes'''
import json
import uuid
import pytest
import service.user as user_service
from random import randint
from helper import random_string
from tests.conftest import content_type

URL = '/match_sequence'
ID_URL = '/match_sequence?id='

NO_DATA_PROVIDED = 'No data was provided'


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET GOALKEEPERS ROUTE
    assert client.get(URL, headers=headers).status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_match_sequence(client, json_headers, match_monitoring):
    '''Test adding a sequence'''
    test_json = {'match_performance_id': str(match_monitoring.id)}
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
    assert response.json == {'error': NO_DATA_PROVIDED}


@pytest.mark.parametrize(['admin'], [[False]])
def test_get_by_id(client, json_headers, match_sequence):
    '''Test getting a sequence by ID'''
    msid = match_sequence.id
    response = client.get(ID_URL + msid, headers=json_headers)
    assert response.status_code == 200
    assert response.json['id'] == msid

    # BAD REQUEST
    response = client.get(ID_URL + str(uuid.uuid4), headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param_diff_category(client, json_headers, match_sequence):
    '''Test setting a parameter as a user from different category'''
    rand_int = randint(0, 5)
    rand_string = random_string.generate(100)
    test_data = {'sequence_number': rand_int, 'reaction_type': rand_string}
    response = client.put(ID_URL + str(match_sequence.id),
                          data=json.dumps(test_data),
                          headers=json_headers)
    assert response.status_code == 401
    assert 'User cannot edit this data.' in response.json['error']


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param_match_category(client, authenticated_user, match_sequence):
    '''Test setting a parameter as a user from same category'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    authenticated_user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(
        authenticated_user,
        match_sequence.match_performance.match.match_category)
    rand_int = randint(0, 5)
    rand_string = random_string.generate(100)
    test_data = {'sequence_number': rand_int, 'reaction_type': rand_string}
    response = client.put(ID_URL + str(match_sequence.id),
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 201


@pytest.mark.parametrize(['admin'], [[False]])
def test_delete_diff_category(client, json_headers, match_sequence):
    '''Test deleting a sequence from a different category'''
    response = client.delete(ID_URL + str(match_sequence.id),
                             headers=json_headers)
    assert response.status_code == 401
    assert 'User cannot edit this data.' in response.json['error']


@pytest.mark.parametrize(['admin'], [[False]])
def test_delete_match_category(client, authenticated_user, match_sequence):
    '''Test deleting a sequence from same category'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    authenticated_user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(
        authenticated_user,
        match_sequence.match_performance.match.match_category)

    response = client.delete(ID_URL + str(match_sequence.id), headers=headers)
    assert response.status_code == 204