'''Testing the category endpoints'''
import json
import random
import pytest
from helper import random_string
from tests.conftest import content_type

URL = '/category'


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_category(client, authenticated_user):
    '''Test add a category route'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }

    test_json = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 201
    assert 'id' in response.json

    ### DUPLICATE ID
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### BAD JSON
    test_json = {}
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}

    test_json = {
        'category_name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    test_json = {
        'name': random_string.generate(12),
        'category_season': random.randint(1500, 2500)
    }
    response = client.post(URL, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_categories(client, authenticated_user):
    '''Test getting categories routes'''
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    name1 = random_string.generate(12)
    name2 = random_string.generate(12)
    season1 = str(random.randint(1500, 2500))
    season2 = str(random.randint(1500, 2500))

    client.post(URL,
                data=json.dumps({
                    'name': name1,
                    'season': season1
                }),
                headers=headers)
    client.post(URL,
                data=json.dumps({
                    'name': name2,
                    'season': season1
                }),
                headers=headers)
    client.post(URL,
                data=json.dumps({
                    'name': name1,
                    'season': season2
                }),
                headers=headers)

    response = client.get(URL, headers=headers)
    assert sum(1 for _ in range(len(response.json))) == 3
    assert response.status_code == 200

    ### GET BY ID
    response = client.get(URL + '?id=' + name1 + season1, headers=headers)
    assert response.json['name'] == name1
    assert response.json['season'] == season1
    assert response.status_code == 200

    ### GET BY USERNAME
    name_url = URL + '?name='
    response = client.get(name_url + name1, headers=headers)
    assert sum(1 for _ in range(len(response.json))) == 2
    assert response.status_code == 200

    response = client.get(name_url + name2, headers=headers)
    assert sum(1 for _ in range(len(response.json))) == 1
    assert response.status_code == 200

    ### GET BY SEASON
    season_url = URL + '?season='
    response = client.get(season_url + season1, headers=headers)
    assert sum(1 for _ in range(len(response.json))) == 2
    assert response.status_code == 200

    response = client.get(season_url + season2, headers=headers)
    assert sum(1 for _ in range(len(response.json))) == 1
    assert response.status_code == 200


@pytest.mark.parametrize(['admin'], [[True]])
def test_delete_category(client, authenticated_user, category):
    '''Test deleting a category'''
    category_id = category.id
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    response = client.delete(URL + '?id=' + category_id, headers=headers)
    assert response.status_code == 204

    response = client.get(URL + '?id=' + category_id, headers=headers)
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
