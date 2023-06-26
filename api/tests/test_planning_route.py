'''Test the planning endpoints'''
import json
import pytest

from helper import random_string, random_date
import service.user as user_service

URL = '/planning'
ID_URL = '/planning?id='

NOT_ALLOWED_MESSAGE = 'User is not allowed'


@pytest.mark.parametrize(['admin'], [[False]])
def test_add_planning_unauthorized(client, json_headers, category):
    '''Test add a planning record without being in the same category'''
    test_json = {
        'category_id': str(category.id),
        'date': random_date.generate().strftime('%d/%m/%Y'),
        'type': random_string.generate(5)
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 401
    assert NOT_ALLOWED_MESSAGE in response.json['error']

    ### BAD JSON
    test_json = {}
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}


@pytest.mark.parametrize(['admin'], [[False]])
def test_add_planning_authorized(client, json_headers, authenticated_user,
                                 category):
    '''Test add a planning record'''
    user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(user, category)

    test_json = {
        'category_id': str(category.id),
        'date': random_date.generate().strftime('%d/%m/%Y'),
        'type': random_string.generate(5)
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 201
    assert 'id' in response.json


@pytest.mark.parametrize(['admin'], [[False]])
def test_get_planning(client, json_headers, planning):
    '''Test get a planning by ID'''
    response = client.get(ID_URL + planning.id, headers=json_headers)
    assert response.json['id'] == planning.id
    assert response.status_code == 200

    # NO ID
    response = client.get(URL, headers=json_headers)
    assert response.status_code == 400
    assert 'No data was provided' in response.json['error']


@pytest.mark.parametrize(['admin'], [[False]])
def test_update_planning_unauthorized(client, json_headers, planning):
    '''Test update different params of a planning without authorization'''
    new_type = random_string.generate(6)
    new_date = random_date.generate().strftime('%d/%m/%Y')
    new_tactics = random_string.generate(8)
    test_json = {'type': new_type, 'date': new_date, 'tactics': new_tactics}
    response = client.put(ID_URL + planning.id,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 401
    assert NOT_ALLOWED_MESSAGE in response.json['error']


@pytest.mark.parametrize(['admin'], [[False]])
def test_update_planning_authorized(client, json_headers, authenticated_user,
                                    planning):
    '''Test update different params of a planning'''
    user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(user, planning.category)

    new_type = random_string.generate(6)
    new_date = random_date.generate().strftime('%d/%m/%Y')
    new_tactics = random_string.generate(8)
    test_json = {'type': new_type, 'date': new_date, 'tactics': new_tactics}
    response = client.put(ID_URL + planning.id,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 201

    response = client.get(ID_URL + planning.id, headers=json_headers)
    assert response.json['type'] == new_type
    assert response.json['date'] == new_date
    assert response.json['tactics'] == new_tactics

    # NO JSON
    response = client.put(ID_URL + planning.id,
                          data=json.dumps({}),
                          headers=json_headers)
    assert response.status_code == 400

    # NO ID
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 400


@pytest.mark.parametrize(['admin'], [[False]])
def test_delete_planning_unauthorized(client, json_headers, planning):
    '''Test delete a planning without authorization'''
    response = client.delete(ID_URL + planning.id, headers=json_headers)
    assert response.status_code == 401
    assert NOT_ALLOWED_MESSAGE in response.json['error']


@pytest.mark.parametrize(['admin'], [[False]])
def test_delete_planning_authorized(client, json_headers, authenticated_user,
                                    planning):
    '''Test delete a planning with authorization'''
    user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(user, planning.category)
    pid = planning.id

    response = client.delete(ID_URL + pid, headers=json_headers)
    assert response.status_code == 204

    response = client.get(ID_URL + pid, headers=json_headers)
    assert 'error' in response.json
