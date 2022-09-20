""" Authentication Service """
from model.user import User
import service.auth as auth_service


def test_authenticate_user(app, user):
    response = auth_service.authenticate_user(user["username"],
                                              user["password"])
    assert "token" in response


def test_get_authenticated_user(app, user):
    token = auth_service.authenticate_user(user["username"],
                                           user["password"])["token"]
    _user: User = auth_service.get_authenticated_user(f'bearer {token}')
    assert _user.username == user["username"]
