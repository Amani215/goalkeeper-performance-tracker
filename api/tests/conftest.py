"""Reusable test items"""
import pytest
from app import create_app
from model import db
from helper import random_string


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
    return {
        "username": random_string.generate(12),
        "password": random_string.generate(12)
    }
