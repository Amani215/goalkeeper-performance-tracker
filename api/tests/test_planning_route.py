'''Test the planning endpoints'''
import json
import pytest

from helper import random_string, random_date
import service.user as user_service

URL = '/planning'


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
    assert 'User is not allowed' in response.json['error']

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
    '''Test add a planning record without being in the same category'''
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