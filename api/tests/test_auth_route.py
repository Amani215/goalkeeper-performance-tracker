'''Testing the auth endpoints'''
import json
import pytest
from helper import random_string
from service.user import add_user

URL_PREFIX = '/api'
URL = URL_PREFIX + '/auth'


@pytest.mark.parametrize(['admin'], [[False]])
def test_authenticate_user(client, json_headers):
    '''Testing the authentication of a user'''
    user = {
        'username': random_string.generate(12),
        'password': random_string.generate(12),
        'admin': False
    }
    add_user(user['username'], user['password'], user['admin'])

    # VALID JSON
    test_json = {'username': user['username'], 'password': user['password']}

    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 200
    assert 'token' in response.json

    # EMPTY JSON
    test_json = {}

    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert response.json['error'] == 'No data was provided'

    # BAD JSON
    test_json = {
        'username': user['username'],
        'password': random_string.generate(12)
    }

    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 401
    assert response.json['error'] == 'Could not verify'
