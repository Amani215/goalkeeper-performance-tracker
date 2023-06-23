''' Authentication Service '''
import pytest
from model.user import User
import service.auth as auth_service
from helper import random_string
from service.user import add_user


def test_authenticate_user(app):
    user = {
        'username': random_string.generate(12),
        'password': random_string.generate(12),
        'admin': False
    }
    add_user(user['username'], user['password'], user['admin'])

    ### SUCCESSFUL AUTHENTICATION
    response = auth_service.authenticate_user(user['username'],
                                              user['password'])
    assert 'token' in response
    assert response['user']['username'] == user['username']

    ### BAD CREDENTIALS
    with pytest.raises(Exception):
        auth_service.authenticate_user(random_string.generate(50),
                                       user['password'])
    with pytest.raises(PermissionError, match='Could not verify'):
        auth_service.authenticate_user(user['username'],
                                       random_string.generate(50))


def test_get_authenticated_user(app):
    user = {
        'username': random_string.generate(12),
        'password': random_string.generate(12),
        'admin': False
    }
    add_user(user['username'], user['password'], user['admin'])

    ### VALID TOKEN
    token = auth_service.authenticate_user(user['username'],
                                           user['password'])['token']
    _user: User = auth_service.get_authenticated_user(f'bearer {token}')
    assert _user.username == user['username']

    ### INVALID TOKEN
    with pytest.raises(ValueError, match='Token is not Bearer token'):
        auth_service.get_authenticated_user(f'not-bearer {token}')
