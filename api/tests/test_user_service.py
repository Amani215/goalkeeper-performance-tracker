'''Testing the user services'''
import uuid
import random
import pytest
from model.user import User
import service.user as user_service
import service.category as category_service
import service.auth as auth_service
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
    user_response = user_service.add_user(user['username'], user['password'],
                                          user['admin'])

    users = user_service.get_users()
    assert len([i.serialize for i in users]) == user_count + 1

    _user: User = user_service.get_by_id(user_response.id)

    assert _user.username == user['username']

    ### DUPLICATE USERNAME
    with pytest.raises(Exception):
        user_service.add_user(user['username'], user['password'],
                              user['admin'])

    ### MIN - MAX FIELDS
    with pytest.raises(ValueError, match='password too short'):
        user_service.add_user(random_string.generate(4),
                              random_string.generate(5), False)

    with pytest.raises(ValueError, match='username too short'):
        user_service.add_user(random_string.generate(3),
                              random_string.generate(6), False)

    with pytest.raises(ValueError, match='password too long'):
        user_service.add_user(random_string.generate(50),
                              random_string.generate(51), False)

    with pytest.raises(ValueError, match='username too long'):
        user_service.add_user(random_string.generate(51),
                              random_string.generate(50), False)


def test_get_users(app, user):
    ''' Test getting all the users in the database'''

    users = user_service.get_users()
    assert len([i.serialize for i in users
                ]) == 2  # Because the default admin should exist too


def test_get_by_username(app, user):
    ''' Test getting a user by its username '''

    _user = user_service.get_by_username(user.username)
    assert _user.username == user.username

    with pytest.raises(Exception):
        user_service.get_by_username(random_string.generate(4))


def test_get_by_id(app, user):
    ''' Test getting a user by its id '''
    response = user_service.get_by_id(user.id)
    assert response.username == user.username

    response = user_service.get_by_id(str(uuid.uuid4()))
    assert 'error' in response


def test_get_by_archived(app, user):
    '''Test get users given their archived attribute'''
    users = user_service.get_by_archived(False)
    assert len([i.serialize for i in users]) == 2  # includes default admin

    users = user_service.get_by_archived(True)
    assert len([i.serialize for i in users]) == 0

    user_service.set_archived(user.username, True, "")

    users = user_service.get_by_archived(False)
    assert len([i.serialize for i in users]) == 1

    users = user_service.get_by_archived(True)
    assert len([i.serialize for i in users]) == 1


def test_verify_user(app):
    ''' Test user verification (login) '''
    user = {
        'username': random_string.generate(12),
        'password': random_string.generate(12),
        'admin': False
    }
    user_service.add_user(user['username'], user['password'], user['admin'])

    response = user_service.verify_user(user['username'], user['password'])
    assert response.username == user['username']

    with pytest.raises(PermissionError, match='Could not verify'):
        user_service.verify_user(user['username'], random_string.generate(50))


def test_add_category(app, user):
    '''Test add a category to the trainer'''
    category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category_response = category_service.add_category(category['name'],
                                                      category['season'])
    category = category_service.get_by_id(category_response.id)
    response = user_service.add_category(user, category)
    assert response['category_id'] == category.id


def test_set_password(app, user):
    '''Test set a new password for the user'''
    # SHORT PASSWORD
    with pytest.raises(ValueError, match='password too short'):
        user_service.set_password(user.id, random_string.generate(1))

    # LONG PASSWORD
    with pytest.raises(ValueError, match='password too long'):
        user_service.set_password(user.id, random_string.generate(100))

    # VALID PASSWORD
    new_password = random_string.generate(12)
    user_service.set_password(user.id, new_password)

    response = auth_service.authenticate_user(user.username, new_password)
    assert 'token' in response


def test_set_password(app, user):
    '''Test set the archived status of the user'''
    assert user.archived == False

    reason = random_string.generate(20)
    user_service.set_archived(user.username, True, reason)
    assert user.archived == True
    assert user.archive_reason == reason


def test_delete_profile_pic(app, user):
    '''Test delete profile pic'''
    user_service.delete_profile_pic(user)
    assert user.profile_pic == ''
