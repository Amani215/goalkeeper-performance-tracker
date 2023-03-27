'''Testing the match endpoints'''
import json
import random
import uuid
import pytest

from helper import random_string, random_date
import service.category as category_service
import service.goalkeeper as goalkeeper_service

URL = '/match'
CATEGORY_URL = '/match/category'
TEAMS_URL = '/match/teams'
DATE_URL = '/match/date'
ID_URL = '/match?id='
PERFORMANCES_URL = '/match/performances?id='
SCORE_URL = '/match/score?id='


def test_no_token(client):
    '''Test protected routes when no token is provided'''
    headers = {'Accept': '*/*'}
    ### GET GOALKEEPERS ROUTE
    assert client.get(URL, headers=headers).status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_matches(client, json_headers, category):
    '''Test getting match routes'''
    category_id = category.id

    response = client.get(URL, headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 0
    assert response.status_code == 200

    ### GET BY ID
    date = random_date.generate(end='31/12/1999')
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4),
        'category_id': category_id
    }
    match = client.post(URL, data=json.dumps(test_json), headers=json_headers)

    response = client.get(ID_URL + match.json['id'], headers=json_headers)
    assert response.status_code == 200
    assert response.json['id'] == match.json['id']

    response = client.get(ID_URL + str(uuid.uuid4), headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### GET BY DATE BEFORE
    date = random_date.generate(start='01/01/2000', end='01/01/2000')
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4),
        'category_id': category_id
    }
    client.post(URL, data=json.dumps(test_json), headers=json_headers)

    date = random_date.generate(start='02/01/2000')
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4),
        'category_id': category_id
    }
    client.post(URL, data=json.dumps(test_json), headers=json_headers)

    response = client.get(URL + '?before=01/01/2000', headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 2

    ### GET BY DATE AFTER
    response = client.get(URL + '?after=02/01/2000', headers=json_headers)
    assert sum(1 for _ in range(len(response.json))) == 1


@pytest.mark.parametrize(['admin'], [[True]])
def test_add_match(client, json_headers, category):
    '''Test add a match'''
    category_id = category.id

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4),
        'category_id': category_id
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 201
    assert 'id' in response.json

    ### BAD JSON
    test_json = {}
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'}

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d-%m-%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4),
        'category_id': category_id
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local_team': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4),
        'category_id': category_id
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor_team': random_string.generate(4),
        'match_type': random_string.generate(4),
        'category_id': category_id
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'type': random_string.generate(4),
        'category_id': category_id
    }
    response = client.post(URL,
                           data=json.dumps(test_json),
                           headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_get_category(client, json_headers, category):
    category_id = category.id
    '''Test setting a category to a match'''
    date = random_date.generate()
    test_json = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4),
        'category_id': category_id
    }
    match = client.post(URL, data=json.dumps(test_json), headers=json_headers)

    _category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category_service.add_category(_category['name'], _category['season'])

    test_data = {
        'match_id': str(match.json['id']),
        'category_id': _category['name'] + str(_category['season'])
    }
    response = client.put(URL,
                          data=json.dumps(test_data),
                          headers=json_headers)
    assert response.status_code == 200

    response = client.get(CATEGORY_URL + "?id=" + match.json['id'],
                          headers=json_headers)
    assert response.json['id'] == _category['name'] + str(_category['season'])

    # NO ID
    response = client.get(CATEGORY_URL, headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_teams_bad_json(client, json_headers):
    '''Test setting teams to a match'''
    # EMPTY JSON
    test_json = {}
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 400

    # NO MATCH ID
    test_json = {
        "local": random_string.generate(3),
        "visitor": random_string.generate(3)
    }
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 400


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_teams_valid_json(client, json_headers, match):
    # VISITOR AND LOCAL
    new_local = random_string.generate(3)
    new_visitor = random_string.generate(3)
    test_json = {
        "match_id": match.id,
        "local": new_local,
        "visitor": new_visitor
    }
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 200


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_local_only(client, json_headers, match):
    '''Test updating local team only'''
    new_local = random_string.generate(3)
    test_json = {"match_id": match.id, "local": new_local}
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 200


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_visitor_only(client, json_headers, match):
    '''Test updating visitor team only'''
    new_visitor = random_string.generate(3)
    test_json = {"match_id": match.id, "visitor": new_visitor}
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 200


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_date_bad_json(client, json_headers):
    '''Test setting the date of a match'''
    # EMPTY JSON
    test_json = {}
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 400

    # NO MATCH ID
    test_json = {"date": random_date.generate().strftime('%d/%m/%Y')}
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 400


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_date_valid_json(client, json_headers, match):
    # NO DATE
    test_json = {"match_id": match.id}
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 200
    _match = client.get(ID_URL + match.id, headers=json_headers)
    assert _match.json['date'] == match.date.strftime('%-d/%-m/%Y')

    # WITH DATE
    new_date = random_date.generate().strftime('%-d/%-m/%Y')
    test_json = {"match_id": match.id, "date": new_date}
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 200
    _match = client.get(ID_URL + match.id, headers=json_headers)
    assert _match.json['date'] == new_date


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_match_type(client, json_headers, match):
    '''Test updating the match type'''
    new_type = random_string.generate(10)

    test_json = {"match_id": match.id, "match_type": new_type}
    response = client.put(URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 200


@pytest.mark.parametrize(['admin'], [[True]])
def test_get_match_performances(client, json_headers, match, goalkeeper):
    '''Test getting the match goalkeeper performances'''
    mid = match.id
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])

    # VALID
    performances = client.get(PERFORMANCES_URL + mid, headers=json_headers)
    assert performances.status_code == 200
    assert len(performances.json) == 0

    test_json = {'goalkeeper_id': _goalkeeper.id, 'match_id': mid}
    client.post('match_monitoring',
                data=json.dumps(test_json),
                headers=json_headers)
    performances = client.get(PERFORMANCES_URL + mid, headers=json_headers)
    assert performances.status_code == 200
    assert len(performances.json) == 1

    # NO ID
    performances = client.get(PERFORMANCES_URL, headers=json_headers)
    assert performances.status_code == 400
    assert 'error' in performances.json


@pytest.mark.parametrize(['admin'], [[True]])
def test_delete_match_performance(client, json_headers, match_monitoring):
    '''Test deleting a goalkeeper performance'''
    mid = match_monitoring.match_id
    test_data = {'goalkeeper_performance_id': str(match_monitoring.id)}

    # VALID TEST
    response = client.delete(PERFORMANCES_URL + mid,
                             data=json.dumps(test_data),
                             headers=json_headers)
    assert response.status_code == 204

    # NO ID
    response = client.delete(PERFORMANCES_URL,
                             data=json.dumps(test_data),
                             headers=json_headers)
    assert response.status_code == 400

    # NO DATA
    response = client.delete(PERFORMANCES_URL + mid, headers=json_headers)
    assert response.status_code == 400


@pytest.mark.parametrize(['admin'], [[True]])
def test_delete_match(client, json_headers, match):
    '''Test deleting a match'''
    match_id = match.id

    response = client.delete(URL + '?id=' + match_id, headers=json_headers)
    assert response.status_code == 204

    response = client.get(URL + '?id=' + match_id, headers=json_headers)
    assert "error" in response.json

    # NO ID
    response = client.delete(URL, headers=json_headers)
    assert response.status_code == 400


@pytest.mark.parametrize(['admin'], [[True]])
def test_delete_with_relationship(client, json_headers, match, goalkeeper):
    '''Test deleting with match related to user'''
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    test_json = {"goalkeeper_id": _goalkeeper.id, "match_id": match.id}

    client.post('/match_monitoring',
                data=json.dumps(test_json),
                headers=json_headers)

    response = client.delete(URL + '?id=' + match.id, headers=json_headers)
    assert response.status_code == 401


@pytest.mark.parametrize(['admin'], [[True]])
def test_set_scores(client, json_headers, match):
    '''Test setting the match scores'''
    mid = match.id

    # NO ID
    test_json = {'score_local': 2, 'score_visitor': 1}
    response = client.put(SCORE_URL,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 400
    assert 'error' in response.json

    # VALID
    test_json = {'score_local': 2, 'score_visitor': 1}
    response = client.put(SCORE_URL + mid,
                          data=json.dumps(test_json),
                          headers=json_headers)
    assert response.status_code == 201
    assert response.json['score_local'] == 2
    assert response.json['score_visitor'] == 1
