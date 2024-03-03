'''Test the calendar endpoints'''
import json
import pytest

from helper import random_string, random_date
import service.user as user_service

URL_PREFIX = '/api'
URL = URL_PREFIX + '/calendar'
ID_URL = URL_PREFIX + '/calendar?id='
ITEM_URL = URL_PREFIX + '/calendar/item'
ID_ITEM_URL = URL_PREFIX + '/calendar/item?id='

NOT_ALLOWED_MESSAGE = 'User is not allowed'
NO_DATA_PROVIDED = 'No data was provided'


# CALENDARS
@pytest.mark.parametrize(['admin'], [[False]])
def test_add_calendar_unauthorized(client, json_headers, category):
    '''Test add a calendar record without being in the same category'''
    test_json = {
        'category_id': str(category.id),
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
    assert response.json == {'error': NO_DATA_PROVIDED}


@pytest.mark.parametrize(['admin'], [[False]])
def test_add_calendar_authorized(client, json_headers, authenticated_user,
                                 category):
    '''Test add a calendar record'''
    user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(user, category)

    test_json = {
        'category_id': str(category.id),
        'type': random_string.generate(5)
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert 'id' in response.json
    assert response.status_code == 201


@pytest.mark.parametrize(['admin'], [[False]])
def test_get_calendar(client, json_headers, calendar):
    '''Test get a calendar by ID'''
    response = client.get(ID_URL + calendar.id, headers=json_headers)
    assert response.json['id'] == calendar.id
    assert response.status_code == 200

    # NO ID
    response = client.get(URL, headers=json_headers)
    assert response.status_code == 400
    assert 'No data was provided' in response.json['error']


@pytest.mark.parametrize(['admin'], [[False]])
def test_delete_calendar_unauthorized(client, json_headers, calendar):
    '''Test delete a calendar without authorization'''
    response = client.delete(ID_URL + calendar.id, headers=json_headers)
    assert response.status_code == 401
    assert NOT_ALLOWED_MESSAGE in response.json['error']


@pytest.mark.parametrize(['admin'], [[False]])
def test_delete_calendar_authorized(client, json_headers, authenticated_user,
                                    calendar):
    '''Test delete a calendar with authorization'''
    user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(user, calendar.calendar_category)
    cid = calendar.id

    response = client.delete(ID_URL + cid, headers=json_headers)
    assert response.status_code == 204

    response = client.get(ID_URL + cid, headers=json_headers)
    assert 'error' in response.json


# ITEMS
@pytest.mark.parametrize(['admin'], [[False]])
def test_add_item_unauthorized(client, json_headers, calendar):
    '''Test add a calendar record without being in the same category'''
    test_json = {
        'calendar_id': str(calendar.id),
        'journey': 1,
        'local': random_string.generate(5),
        'visitor': random_string.generate(5)
    }
    response = client.post(ITEM_URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 401
    assert NOT_ALLOWED_MESSAGE in response.json['error']

    ### BAD JSON
    test_json = {}
    response = client.post(ITEM_URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert response.json == {'error': NO_DATA_PROVIDED}


@pytest.mark.parametrize(['admin'], [[False]])
def test_add_item_authorized(client, json_headers, authenticated_user,
                             calendar, category):
    '''Test add a calendar record'''
    user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(user, category)

    test_json = {
        'calendar_id': str(calendar.id),
        'journey': 1,
        'local': random_string.generate(5),
        'visitor': random_string.generate(5)
    }
    response = client.post(ITEM_URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 201
    assert 'id' in response.json
