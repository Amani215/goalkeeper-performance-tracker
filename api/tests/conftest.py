"""Reusable test items"""
import pytest
from app import create_app
from config.postgres import db
from helper import random_string
import service.user as user_service


@pytest.fixture()
def app():
    """Create a mock app instance"""
    db.session.remove()
    db.drop_all()
    _app = create_app()

    yield _app

    db.session.remove()
    db.drop_all()


@pytest.fixture()
def user():
    """ Create a mock user """
    user_credentials = {
        "username": random_string.generate(12),
        "password": random_string.generate(12)
    }
    user_service.add_user(user_credentials["username"],
                          user_credentials["password"])
    return user_credentials
