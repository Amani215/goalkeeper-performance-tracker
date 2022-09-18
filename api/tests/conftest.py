"""Reusable test items"""
import pytest
from app import create_app, setup_database
from flask_sqlalchemy import SQLAlchemy

@pytest.fixture()
def app():
    """Create a mock db instance"""
    _app = create_app()
    
    yield _app

    # clean up / reset resources here

@pytest.fixture()
def client(app):
    return app.test_client()
