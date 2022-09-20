"""Reusable test items"""
import pytest
from app import create_app
from model import db
from helper import random_string


@pytest.fixture()
def app():
    db.session.remove()
    db.drop_all()
    """Create a mock db instance"""
    _app = create_app()

    yield _app
    db.session.remove()
    db.drop_all()
    # clean up / reset resources here


@pytest.fixture()
def user():
    return {
        "username": random_string.generate(12),
        "password": random_string.generate(12)
    }
