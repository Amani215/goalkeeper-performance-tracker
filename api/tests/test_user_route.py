"""Testing the user endpoints"""
import json
import uuid

from helper import random_string
from tests.conftest import content_type

url = '/user'

def test_no_token(client):
    """Test protected routes when no token is provided"""
    assert client.get(url).status_code == 401

def test_get_users(client, authenticated_user):
    """Test getting user routes"""
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': authenticated_user['token']
    }
    response = client.get(url, json={}, headers=headers)
    assert sum(1 for _ in range(len(response.json))) == 1
    assert response.status_code == 200
    
    ### GET BY USERNAME
    test_json = {
        'username': authenticated_user['username']
    }
    response = client.get(url, json=test_json, headers=headers)
    assert response.status_code == 200
    assert response.json['username'] == authenticated_user['username']
    
    test_json = {
        'username': random_string.generate(4)
    }
    response = client.get(url, json=test_json, headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

    ### GET BY ID
    test_json = {
        'id': authenticated_user['id']
    }
    response = client.get(url, json=test_json, headers=headers)
    assert response.status_code == 200
    assert response.json['id'] == authenticated_user['id']
    
    test_json = {
        'id': str(uuid.uuid4)
    }
    response = client.get(url, json=test_json, headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json
    
def test_add_user(client):
    """Test add a user"""
    headers = {
        'Content-Type': content_type,
        'Accept': content_type
    }
    
    test_json = {
        'username': random_string.generate(12),
        'password': random_string.generate(12)
    }
    response = client.post(url, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 200
    assert 'user_id' in response.json 
    
    ### DUPLICATE USERNAME
    response = client.post(url, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json 
    
    ### BAD JSON
    test_json = {}
    response = client.post(url, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'No data was provided'} 
    
    test_json = {
        'user': random_string.generate(4),
        'password': random_string.generate(5)
    }
    response = client.post(url, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json
    
    test_json = {
        'username': random_string.generate(4),
        'pass': random_string.generate(5)
    }
    response = client.post(url, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json
    
    ### MIN - MAX FIELDS
    test_json = {
        'username': random_string.generate(4),
        'password': random_string.generate(5)
    }
    response = client.post(url, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'password too short'}

    test_json = {
        'username': random_string.generate(3),
        'password': random_string.generate(6)
    }
    response = client.post(url, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'username too short'}
    
    test_json = {
        'username': random_string.generate(50),
        'password': random_string.generate(51)
    }
    response = client.post(url, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'password too long'}

    test_json = {
        'username': random_string.generate(51),
        'password': random_string.generate(50)
    }
    response = client.post(url, data=json.dumps(test_json), headers=headers)
    assert response.status_code == 400
    assert response.json == {'error': 'username too long'}
