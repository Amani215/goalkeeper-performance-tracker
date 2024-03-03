'''Testing the growth monitoring endpoints'''
import json
import random
import uuid
import pytest

from helper import random_string, random_date
from tests.conftest import content_type
import service.goalkeeper as goalkeeper_service
import service.user as user_service

URL_PREFIX = '/api'
URL = URL_PREFIX + '/growth_monitoring'
ID_URL = URL_PREFIX + '/growth_monitoring?id='
DATE_FORMAT = '%d/%m/%Y'


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET GROWTH MONITORINGS ROUTE
    assert client.get(URL, headers=headers).status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_growth_monitorings(client, json_headers):
    '''Test getting growth monitoring routes'''
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
        'goalkeeper_id': goalkeeper.json['id'],
        'date': date.strftime(DATE_FORMAT)
    }
    growth_monitoring = client.post(URL,
                                    data=json.dumps(test_json),
                                    headers=json_headers)

    response = client.get(ID_URL + growth_monitoring.json['id'],
                          headers=json_headers)
    assert response.status_code == 200
    assert response.json['id'] == growth_monitoring.json['id']

    response = client.get(ID_URL + str(uuid.uuid4), headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### GET BY GOALKEEPER ID
    test_json = {
        'name': random_string.generate(12),
        'day': date.day,
        'month': date.month,
        'year': date.year
    }
    goalkeeper_2 = client.post('/goalkeeper',
                               data=json.dumps(test_json),
                               headers=json_headers)

    date = random_date.generate()
    test_json = {
        'goalkeeper_id': goalkeeper_2.json['id'],
        'date': date.strftime(DATE_FORMAT)
    }
    client.post(URL, data=json.dumps(test_json), headers=json_headers)

    response = client.get('/growth_monitoring?gid=' + goalkeeper_2.json['id'],
                          headers=json_headers)
    assert response.status_code == 200
    assert sum(1 for _ in range(len(response.json))) == 1

    response = client.get('/growth_monitoring?gid=' + str(uuid.uuid4),
                          headers=json_headers)
    assert response.status_code == 200
    assert sum(1 for _ in range(len(response.json))) == 0


@pytest.mark.parametrize(['admin'], [[False]])
def test_add_growth_monitoring(client, authenticated_user, goalkeeper,
                               category):
    '''Test add a growth monitoring object'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    ### USER FROM DIFFERENT CATEGORY
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    goalkeeper_service.add_category(_goalkeeper, category)

    date = random_date.generate()
    test_json = {
        'goalkeeper_id': str(_goalkeeper.id),
        'date': date.strftime(DATE_FORMAT)
    }

    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 401
    assert 'User cannot edit this goalkeeper.' in response.json['error']

    ### USER FROM SAME CATEGORY
    authenticated_user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(authenticated_user, category)

    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 201

    ### BAD JSON
    test_json = {}
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param(client, authenticated_user, goalkeeper, category):
    '''Test setting a param to a growth monitoring object'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    authenticated_user = user_service.get_by_id(authenticated_user['id'])

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    goalkeeper_service.add_category(_goalkeeper, category)
    user_service.add_category(authenticated_user, category)

    date = random_date.generate()
    test_json = {
        'goalkeeper_id': str(_goalkeeper.id),
        'date': date.strftime(DATE_FORMAT)
    }
    growth_monitoring_obj = client.post(URL,
                                        data=json.dumps(test_json),
                                        headers=headers)
    assert growth_monitoring_obj.status_code == 201

    ### USER FROM SAME CATEGORY
    rand_int1 = random.randint(60, 90)
    rand_int2 = random.randint(0, 30)
    rand_date = random_date.generate().strftime(DATE_FORMAT)
    test_data = {
        'weight': rand_int1,
        'annual_growth': rand_int2,
        'date': rand_date
    }
    response = client.put(ID_URL + growth_monitoring_obj.json['id'],
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 201

    response = client.get(ID_URL + growth_monitoring_obj.json['id'],
                          headers=headers)
    assert response.json['weight'] == rand_int1
    assert response.json['annual_growth'] == rand_int2
    assert response.json['date'] == rand_date

    # NO ID
    response = client.put(URL, data=json.dumps(test_data), headers=headers)
    assert response.status_code == 400

    # NO JSON
    response = client.put(ID_URL + growth_monitoring_obj.json['id'],
                          headers=headers)
    assert response.status_code == 400


@pytest.mark.parametrize(['admin'], [[False]])
def test_set_param_diff_category(client, json_headers, category,
                                 growth_monitoring):
    '''Test setting a param to a growth monitoring object'''
    goalkeeper = goalkeeper_service.get_by_id(growth_monitoring.goalkeeper_id)
    goalkeeper_service.add_category(goalkeeper, category)

    ### USER FROM DIFFERENT CATEGORY
    rand_int1 = random.randint(60, 90)
    rand_int2 = random.randint(0, 30)
    test_data = {'weight': rand_int1, 'annual_growth': rand_int2}
    response = client.put(ID_URL + str(growth_monitoring.id),
                          data=json.dumps(test_data),
                          headers=json_headers)
    assert response.status_code == 401
    assert 'User cannot edit this goalkeeper.' in response.json['error']


@pytest.mark.parametrize(['admin'], [[False]])
def test_delete(client, json_headers, growth_monitoring):
    '''Test deleting a growth monitoring object'''
    gm_id = growth_monitoring.id

    response = client.delete(ID_URL + gm_id, headers=json_headers)
    assert response.status_code == 204

    response = client.get(ID_URL + gm_id, headers=json_headers)
    assert "error" in response.json

    # NO ID
    response = client.delete(URL, headers=json_headers)
    assert response.status_code == 400
