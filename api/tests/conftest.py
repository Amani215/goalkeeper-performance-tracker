"""Reusable test items"""
import pytest
from app import create_app
from model import db


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
def client(app):
    return app.test_client()
