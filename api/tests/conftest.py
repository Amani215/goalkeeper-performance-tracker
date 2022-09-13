"""Reusable test items"""
import pytest
from app import create_app, setup_database

@pytest.fixture()
def app():
    """Create a mock app instance"""
    _app = create_app()
    _app.config.update({
        "TESTING": True,
    })

    setup_database(_app)

    yield _app

    # clean up / reset resources here
