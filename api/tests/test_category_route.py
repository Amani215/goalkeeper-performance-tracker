'''Testing the category endpoints'''
import json
import random
import pytest
from helper import random_date, random_string
from tests.conftest import content_type
import service.user as user_service

URL_PREFIX = '/api'
URL = URL_PREFIX + '/category'
TRAINERS_URL = URL_PREFIX + '/category/trainers?id='
GOALKEEPERS_URL = URL_PREFIX + '/category/goalkeepers?id='
PLANNINGS_URL = URL_PREFIX + '/category/plannings?id='
CALENDARS_URL = URL_PREFIX + '/category/calendars?id='
ID_URL = URL_PREFIX + '/category?id='


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_category(client, json_headers):
    '''Test add a category route'''
    test_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 201
    assert 'id' in response.json

    ### DUPLICATE ID
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### BAD JSON
    test_json = {}
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}

    test_json = {
        'category_name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    test_json = {
        'name': random_string.generate(12),
        'category_season': random.randint(1500, 2500)
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_categories(client, json_headers):
    '''Test getting categories routes'''
    name1 = random_string.generate(12)
    name2 = random_string.generate(12)
    season1 = str(random.randint(1500, 2500))
    season2 = str(random.randint(1500, 2500))

    client.post(URL,
                data=json.dumps({
                    'name': name1,
                    'season': season1
                }),
                headers=json_headers)
    client.post(URL,
                data=json.dumps({
                    'name': name2,
                    'season': season1
                }),
                headers=json_headers)
    client.post(URL,
                data=json.dumps({
                    'name': name1,
                    'season': season2
                }),
                headers=json_headers)

    response = client.get(URL, headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 3
    assert response.status_code == 200

    ### GET BY ID
    response = client.get(URL + '?id=' + name1 + season1, headers=json_headers)
    assert response.json['name'] == name1
    assert response.json['season'] == season1
    assert response.status_code == 200

    ### GET BY USERNAME
    name_url = URL + '?name='
    response = client.get(name_url + name1, headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 2
    assert response.status_code == 200

    response = client.get(name_url + name2, headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 1
    assert response.status_code == 200

    ### GET BY SEASON
    season_url = URL + '?season='
    response = client.get(season_url + season1, headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 2
    assert response.status_code == 200

    response = client.get(season_url + season2, headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 1
    assert response.status_code == 200

    ### GET BY ARCHIVED
    archived_url = URL + '?archived='
    response = client.get(archived_url + 'True', headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 0
    assert response.status_code == 200

    response = client.get(archived_url + 'False', headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 3
    assert response.status_code == 200


@pytest.mark.parametrize(['admin'], [[True]])
def test_delete_category(client, json_headers, category):
    '''Test deleting a category'''
    category_id = category.id

    # NO ID
    response = client.get(URL + '?id=', headers=json_headers)
    assert response.status_code == 400
    assert "error" in response.json

    # VALID
    response = client.delete(URL + '?id=' + category_id, headers=json_headers)
    assert response.status_code == 204

    response = client.get(URL + '?id=' + category_id, headers=json_headers)
    assert "error" in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_delete_with_relationship(client, authenticated_user, category):
    '''Test deleting with category related to user'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    test_json = {
        "trainer_id": authenticated_user['id'],
        "category_id": category.id
    }
    client.put('/user/category', data=json.dumps(test_json), headers=headers)

    response = client.delete(URL + '?id=' + category.id, headers=headers)
    assert response.status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_trainers(client, json_headers, user):
    '''Test getting the category trainers'''
    user_id = user.id

    # NO ID
    trainers = client.get(TRAINERS_URL, headers=json_headers)
    assert trainers.status_code == 400
    assert 'error' in trainers.json

    # VALID
    test_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)

    trainers = client.get(TRAINERS_URL + category.json['id'],
                          headers=json_headers)
    assert trainers.status_code == 200
    assert len(trainers.json) == 0

    test_json = {'trainer_id': user_id, 'category_id': category.json['id']}
    client.put('/user/category',
               data=json.dumps(test_json),
               headers=json_headers)
    trainers = client.get(TRAINERS_URL + category.json['id'],
                          headers=json_headers)
    assert trainers.status_code == 200
    assert len(trainers.json) == 1


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_goalkeepers(client, goalkeeper, json_headers):
    '''Test getting the category goalkeepers'''
    # NO ID
    goalkeepers = client.get(GOALKEEPERS_URL, headers=json_headers)
    assert goalkeepers.status_code == 400
    assert 'error' in goalkeepers.json

    # VALID
    test_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)

    goalkeepers = client.get(GOALKEEPERS_URL + category.json['id'],
                             headers=json_headers)
    assert goalkeepers.status_code == 200
    assert len(goalkeepers.json) == 0

    _goalkeeper = client.get('/goalkeeper?name=' + goalkeeper['name'],
                             headers=json_headers)
    test_json = {
        'goalkeeper_id': _goalkeeper.json['id'],
        'category_id': category.json['id']
    }
    client.put('/goalkeeper/category',
               data=json.dumps(test_json),
               headers=json_headers)
    goalkeepers = client.get(GOALKEEPERS_URL + category.json['id'],
                             headers=json_headers)
    assert goalkeepers.status_code == 200
    assert len(goalkeepers.json) == 1


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_plannings(client, json_headers, authenticated_user, category):
    '''Test getting the plannings of a category'''
    cid = category.id
    user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(user, category)

    # NO ID
    plannings = client.get(PLANNINGS_URL, headers=json_headers)
    assert plannings.status_code == 400
    assert 'error' in plannings.json

    # VALID
    plannings = client.get(PLANNINGS_URL + cid, headers=json_headers)
    assert plannings.status_code == 200
    assert len(plannings.json) == 0

    test_json = {
        'category_id': str(category.id),
        'date': random_date.generate().strftime('%d/%m/%Y'),
        'type': random_string.generate(5)
    }
    client.post('/planning', data=json.dumps(test_json), headers=json_headers)
    plannings = client.get(PLANNINGS_URL + cid, headers=json_headers)
    assert plannings.status_code == 200
    assert len(plannings.json) == 1


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_calendars(client, json_headers, authenticated_user, category):
    '''Test getting the calendars of a category'''
    cid = category.id
    user = user_service.get_by_id(authenticated_user['id'])
    user_service.add_category(user, category)

    # NO ID
    calendars = client.get(CALENDARS_URL, headers=json_headers)
    assert calendars.status_code == 400
    assert 'error' in calendars.json

    # VALID
    calendars = client.get(CALENDARS_URL + cid, headers=json_headers)
    assert calendars.status_code == 200
    assert len(calendars.json) == 0

    test_json = {
        'category_id': str(category.id),
        'type': random_string.generate(5),
        'journey': 1,
        'local': random_string.generate(5),
        'visitor': random_string.generate(5)
    }
    client.post('/calendar', data=json.dumps(test_json), headers=json_headers)
    calendars = client.get(CALENDARS_URL + cid, headers=json_headers)
    assert calendars.status_code == 200
    assert len(calendars.json) == 1


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_archived(client, json_headers):
    '''Test set the archived attribute'''
    test_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert category.json['archived'] == False
    client.put(ID_URL + category.json['id'],
               data=json.dumps({'archived': True}),
               headers=json_headers)

    category = client.get(ID_URL + category.json['id'], headers=json_headers)
    assert category.json['archived'] == True

    # NO JSON
    response = client.put(ID_URL + category.json['id'], headers=json_headers)
    assert response.status_code == 400
