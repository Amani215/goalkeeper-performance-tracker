"""Testing the user endpoints"""
from model.user import User
import service.user as user_service
from helper import random_string

def test_add_user(app, user):
    users = user_service.get_users()
    user_count = len([i.serialize for i in users])
    
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
    user_service.add_user(user["username"],user["password"])
    users = user_service.get_users()
    assert len([i.serialize for i in users]) == 1

def test_get_by_username():
    # TODO
    pass

def test_get_by_id():
    # TODO
    pass

def test_verify_user():
    # TODO
    pass