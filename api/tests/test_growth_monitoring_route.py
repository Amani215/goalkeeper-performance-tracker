'''Testing the growth monitoring endpoints'''
import json
import random
import uuid
import pytest

from helper import random_string, random_date
from tests.conftest import content_type
import service.goalkeeper as goalkeeper_service

URL = '/growth_monitoring'
ID_URL = '/growth_monitoring?id='


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET GROWTH MONITORINGS ROUTE
    assert client.get(URL, headers=headers).status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_growth_monitorings(client, authenticated_user):
    '''Test getting growth monitoring routes'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    response = client.get(URL, headers=headers)
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
                             headers=headers)

    date = random_date.generate()
    test_json = {
        'goalkeeper_id': goalkeeper.json['id'],
        'date': date.strftime('%d/%m/%Y')
    }
    growth_monitoring = client.post(URL,
                                    data=json.dumps(test_json),
                                    headers=headers)

    response = client.get(ID_URL + growth_monitoring.json['id'],
                          headers=headers)
    assert response.status_code == 200
    assert response.json['id'] == growth_monitoring.json['id']

    response = client.get(ID_URL + str(uuid.uuid4), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_grwoth_monitoring(client, authenticated_user, goalkeeper):
    '''Test add a growth monitoring object'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    date = random_date.generate()
    test_json = {
        'goalkeeper_id': str(_goalkeeper.id),
        'date': date.strftime('%d/%m/%Y')
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 201
    assert 'id' in response.json

    ### BAD JSON
    test_json = {}
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_param(client, authenticated_user, goalkeeper, match):
    '''Test setting a param to a growth monitoring object'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    date = random_date.generate()
    test_json = {
        'goalkeeper_id': str(_goalkeeper.id),
        'date': date.strftime('%d/%m/%Y')
    }
    growth_monitoring_obj = client.post(URL,
                                        data=json.dumps(test_json),
                                        headers=headers)

    rand_int1 = random.randint(60, 90)
    rand_int2 = random.randint(0, 30)
    test_data = {'weight': rand_int1, 'annual_growth': rand_int2}
    response = client.put(ID_URL + growth_monitoring_obj.json['id'],
                          data=json.dumps(test_data),
                          headers=headers)
    assert response.status_code == 201

    response = client.get(ID_URL + growth_monitoring_obj.json['id'],
                          headers=headers)
    assert response.json['weight'] == rand_int1
    assert response.json['annual_growth'] == rand_int2