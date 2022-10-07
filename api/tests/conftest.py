"""Reusable test items"""
import pytest
from botocore.client import ClientError
from app import create_app
from config.postgres import db
from helper import random_string
import service.user as user_service
from config.s3 import s3_client, s3_resource


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
def client(app):
    return app.test_client()

@pytest.fixture()
def bucket():
    """Create a test bucket"""
    bucket_name = 'test-bucket'
    
    try:
        s3_client.create_bucket(Bucket=bucket_name)
    except ClientError as err:
        print('error:', err)
    
    yield s3_resource.Bucket(bucket_name)
    
    try:
        _bucket = s3_resource.Bucket(bucket_name)
        _bucket.objects.all().delete()
        _bucket.delete()
    except ClientError as err:
        print("error:", err)
    
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
