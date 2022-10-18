'''Testing the user services'''
import uuid
import random
import pytest
from model.user import User
import service.user as user_service
import service.category as category_service
from helper import random_string


def test_add_user(app):
    ''' Test adding user '''
    
    users = user_service.get_users()
    user_count = len([i.serialize for i in users])
    user = {
        'username': random_string.generate(12),
        'password': random_string.generate(12),
        'admin': False
    }
    user_response=user_service.add_user(user['username'], user['password'], user['admin'])
    
    users = user_service.get_users()
    assert len([i.serialize for i in users]) == user_count+1
    
    _user:User = user_service.get_by_id(user_response['user_id'])
    
    assert _user.username == user['username']
    
    ### DUPLICATE USERNAME
    with pytest.raises(Exception):
        user_service.add_user(user['username'], user['password'], user['admin'])
        
    ### MIN - MAX FIELDS
    
    with pytest.raises(ValueError, match='password too short'):
        user_service.add_user(random_string.generate(4), random_string.generate(5), False)

    with pytest.raises(ValueError, match='username too short'):
        user_service.add_user(random_string.generate(3), random_string.generate(6), False)
   
    with pytest.raises(ValueError, match='password too long'): 
        user_service.add_user(random_string.generate(50), random_string.generate(51), False)
    
    with pytest.raises(ValueError, match='username too long'): 
        user_service.add_user(random_string.generate(51), random_string.generate(50), False)

def test_get_users(app,user):
    ''' Test getting all the users in the database'''
    
    users = user_service.get_users()
    assert len([i.serialize for i in users]) == 2   # Because the default admin should exist too

def test_get_by_username(app, user):
    ''' Test getting a user by its username '''
    
    _user = user_service.get_by_username(user['username'])
    assert _user.username == user['username']
    
    with pytest.raises(Exception):
        user_service.get_by_username(random_string.generate(4))

def test_get_by_id(app, user):
    ''' Test getting a user by its id '''
    
    user_id = user_service.get_by_username(user['username']).id
    _user = user_service.get_by_id(user_id)
    
    assert _user.username == user['username']
    
    _user = user_service.get_by_id(str(uuid.uuid4()))
    assert 'error' in _user

def test_verify_user(app, user):
    ''' Test user verification (login) '''
    
    response = user_service.verify_user(user['username'], user['password'])
    assert response.username == user['username']
    
    with pytest.raises(PermissionError, match='Could not verify'):
        user_service.verify_user(user['username'], random_string.generate(50))

def test_add_category(app, user):
    '''Test add a category to the trainer'''
    category = {
        'name': random_string.generate(12),
        'season': random.randint(1500,2500)
    }
    category_response=category_service.add_category(category['name'], category['season'])
    category = category_service.get_by_id(category_response['category_id'])
    _user = user_service.get_by_username(user['username'])
    response = user_service.add_category(_user, category)
    assert response['category_id'] == category.id
