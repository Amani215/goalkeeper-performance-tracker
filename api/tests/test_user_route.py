'''Testing the user endpoints'''
import io
import json
import os
import random
import uuid
import pytest

from helper import random_string
import service.category as category_service
from tests.conftest import content_type

URL = '/user'
PROFILE_PIC_URL = '/user/profile_pic'
ADMIN_URL = '/user/admin'
CATEGORY_URL = '/user/category'
USERNAME_URL = '/user?username='


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET USERS ROUTE
    assert client.get(URL, headers=headers).status_code == 401

    ### ADD IMAGE ROUTE
    test_data = {
        'profile_pic':
        (io.BytesIO(b'test_profile_pic'), 'tests/assets/image.jpeg'),
    }
    response = client.put(PROFILE_PIC_URL, data=test_data, headers=headers)
    assert response.status_code == 401


@pytest.mark.parametrize(['admin'], [[False]])
def test_get_users(client, authenticated_user):
    '''Test getting user routes'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    response = client.get(URL, headers=headers)
    assert sum(1 for _ in range(len(
        response.json))) == 2  # Because the default admin should exist too
    assert response.status_code == 200

    ### GET BY USERNAME
    response = client.get(USERNAME_URL + authenticated_user['username'],
                          headers=headers)
    assert response.status_code == 200
    assert response.json['username'] == authenticated_user['username']

    response = client.get(USERNAME_URL + random_string.generate(4),
                          headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### GET BY ID
    id_url = URL + '?id='

    response = client.get(id_url + authenticated_user['id'], headers=headers)
    assert response.status_code == 200
    assert response.json['id'] == authenticated_user['id']

    response = client.get(id_url + str(uuid.uuid4), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_user(client, authenticated_user):
    '''Test add a user'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    test_json = {
        'username': random_string.generate(12),
        'password': random_string.generate(12),
        'admin': False
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 201
    assert 'id' in response.json

    ### DUPLICATE USERNAME
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### BAD JSON
    test_json = {}
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}

    test_json = {
        'user': random_string.generate(4),
        'password': random_string.generate(5),
        'admin': False
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    test_json = {
        'username': random_string.generate(4),
        'pass': random_string.generate(5),
        'admin': False
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    test_json = {
        'username': random_string.generate(4),
        'pass': random_string.generate(5),
        'ad': False
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### MIN - MAX FIELDS
    test_json = {
        'username': random_string.generate(4),
        'password': random_string.generate(5),
        'admin': False
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'password too short'}

    test_json = {
        'username': random_string.generate(3),
        'password': random_string.generate(6),
        'admin': False
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'username too short'}

    test_json = {
        'username': random_string.generate(50),
        'password': random_string.generate(51),
        'admin': False
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'password too long'}

    test_json = {
        'username': random_string.generate(51),
        'password': random_string.generate(50),
        'admin': False
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'username too long'}


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_admin(client, authenticated_user, user):
    '''Test setting a user to admin'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    test_data = {'username': user['username'], 'admin': True}
    response = client.put(ADMIN_URL,
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 200

    response = client.get(USERNAME_URL + user['username'], headers=headers)
    assert response.json['admin'] == True

    ### BAD JSON
    response = client.put(ADMIN_URL, data=json.dumps({}), headers=headers)
    assert response.status_code == 400

    test_data = {'name': user['username'], 'admin': True}
    response = client.put(ADMIN_URL,
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 400

    test_data = {'username': user['username'], 'ad': True}
    response = client.put(ADMIN_URL,
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 400

    test_data = {'username': random_string.generate(4), 'admin': True}
    response = client.put(ADMIN_URL,
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 400

    ### UPDATE DEFAULT ADMIN
    test_data = {'username': os.environ['ADMIN_USERNAME'], 'admin': False}
    response = client.put(ADMIN_URL,
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 401
    assert 'Default admin cannot be changed' in response.json['error']


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_remove_category(client, authenticated_user, user):
    '''Test adding and removing a category to a trainer'''
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
    response = client.get(USERNAME_URL + user['username'], headers=headers)

    test_data = {
        'trainer_id': response.json['id'],
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
def test_add_profile_pic(client, authenticated_user):
    '''Test adding a profile pic to the current user route'''
    headers = {'Accept': '*/*', 'Authorization': authenticated_user['token']}
    test_data = {
        'profile_pic':
        (io.BytesIO(b'test_profile_pic'), 'tests/assets/image.jpeg'),
    }
    response = client.put(PROFILE_PIC_URL, data=test_data, headers=headers)
    assert response.status_code == 200
    assert 'url' in response.json

    response = client.put(PROFILE_PIC_URL, data={}, headers=headers)
    assert response.status_code == 400
    assert 'No data was provided' in response.json['error']