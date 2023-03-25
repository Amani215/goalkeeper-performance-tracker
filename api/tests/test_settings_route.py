'''Testing the settings endpoints'''
import json
import pytest
import init.redis_init as redis_db
from helper import random_string

URL = '/settings'

NO_SUCH_KEY_EXISTS = 'No such key exists'
NO_DATA = 'No data was provided'

keys = list(redis_db.get_tables().keys())


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_item(client, json_headers):
    '''Testing the addition of a settings item'''
    # INVALID KEY
    test_json = {'value': random_string.generate(10)}
    key = random_string.generate(10)
    response = client.post(URL + '/' + key,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert response.json['error'] == NO_SUCH_KEY_EXISTS

    # INVALID JSON
    test_json = {}
    key = keys[0]
    response = client.post(URL + '/' + key,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert response.json['error'] == NO_DATA

    # VALID JSON
    new_value = random_string.generate(5)
    test_json = {'value': new_value}
    response = client.post(URL + '/' + key,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 201
    assert response.json['new value'] == new_value


@pytest.mark.parametrize(['admin'], [[False]])
def test_get_items(client, json_headers):
    '''Test getting all settings'''
    # INVALID KEY
    key = random_string.generate(10)
    response = client.get(URL + '/' + key, headers=json_headers)
    assert response.status_code == 400
    assert response.json['error'] == NO_SUCH_KEY_EXISTS

    # VALID KEY
    key = keys[0]
    response = client.get(URL + '/' + key, headers=json_headers)
    assert response.status_code == 200


@pytest.mark.parametrize(['admin'], [[True]])
def test_delete_item(client, json_headers):
    '''Test the deletion of an item'''
    # INVALID KEY
    test_json = {'value': keys[0][0]}
    key = random_string.generate(10)
    response = client.delete(URL + '/' + key,
                             data=json.dumps(test_json),
                             headers=json_headers)
    assert response.status_code == 400
    assert response.json['error'] == NO_SUCH_KEY_EXISTS

    # INVALID JSON
    test_json = {}
    key = keys[0]
    response = client.delete(URL + '/' + key,
                             data=json.dumps(test_json),
                             headers=json_headers)
    assert response.status_code == 400
    assert response.json['error'] == NO_DATA

    # VALID JSON
    value = keys[0][0]
    test_json = {'value': value}
    key = keys[0]
    response = client.delete(URL + '/' + key,
                             data=json.dumps(test_json),
                             headers=json_headers)
    assert response.status_code == 204
