"""Testing the user endpoints"""
import json


def test_no_token(client):
    """Test protected routes when no token is provided"""
    assert client.get('/user').status_code == 401

def test_add_user(client):
    """Test add a user"""
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    test_json = {
        'username':'test',
        'password':'test'
    }
    url = '/user'
    response = client.post(url, data=json.dumps(test_json), headers=headers)
    
    assert response.status_code == 400
    assert response.json == {'error': 'password too short'}
