"""Testing the user endpoints"""
from model.user import User
import service.user as user_service
import random

def test_get_users():
    users = user_service.get_users()
   
    assert len([i.serialize for i in users]) == 0

def test_add_user():
    random.seed()
    users = user_service.get_users()
    user_count = len([i.serialize for i in users])
    
    username = 'amani'
    password = 'brik'
    user_response=user_service.create_user(username,password)
    
    users = user_service.get_users()
    assert len([i.serialize for i in users]) == user_count+1
    
    user:User = user_service.get_by_id(user_response['user_id'])
    
    assert user.username == username

def test_fail():
    assert 1==2