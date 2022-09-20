"""Testing the user endpoints"""
from model.user import User
import service.user as user_service
from helper import random_string
import uuid


def test_add_user(app):
    """ Test adding user """
    
    users = user_service.get_users()
    user_count = len([i.serialize for i in users])
    user = {
        "username": random_string.generate(12),
        "password": random_string.generate(12)
    }
    user_response=user_service.add_user(user["username"],user["password"])
    
    users = user_service.get_users()
    assert len([i.serialize for i in users]) == user_count+1
    
    _user:User = user_service.get_by_id(user_response['user_id'])
    
    assert _user.username == user["username"]
    
    ### DUPLICATE USERNAME
    
    user_response=user_service.add_user(user["username"],user["password"])
    assert "duplicate key value" in user_response["error"]
    
    ### MIN - MAX FIELDS
    
    user_response=user_service.add_user(random_string.generate(4),random_string.generate(5))
    assert "password too short" in user_response["error"]
    user_response=user_service.add_user(random_string.generate(3),random_string.generate(6))
    assert "username too short" in user_response["error"]
    user_response=user_service.add_user(random_string.generate(50),random_string.generate(51))
    assert "password too long" in user_response["error"]
    user_response=user_service.add_user(random_string.generate(51),random_string.generate(50))
    assert "username too long" in user_response["error"]

def test_get_users(app,user):
    """ Test getting all the users in the database"""
    
    users = user_service.get_users()
    assert len([i.serialize for i in users]) == 1

def test_get_by_username(app, user):
    """ Test getting a user by its username """
    
    _user = user_service.get_by_username(user["username"])
    assert _user.username == user["username"]
    
    _user = user_service.get_by_username(random_string.generate(4))
    assert "error" in _user

def test_get_by_id(app, user):
    """ Test getting a user by its id """
    
    user_id = user_service.get_by_username(user["username"]).id
    _user = user_service.get_by_id(user_id)
    
    assert _user.username == user["username"]
    
    _user = user_service.get_by_id(str(uuid.uuid4()))
    assert "error" in _user

def test_verify_user(app, user):
    """ Test user verification (login) """
    
    response = user_service.verify_user(user["username"], user["password"])
    assert response.username == user["username"]
    
    response = user_service.verify_user(user["username"], random_string.generate(50))
    assert "Could not verify" in response["error"]