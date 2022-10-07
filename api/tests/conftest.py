"""Reusable test items"""
import json
import pytest
from botocore.client import ClientError
from app import create_app
from config.postgres import db
from config.s3 import s3_client, s3_resource
from helper import random_string
import service.user as user_service

content_type = 'application/json'

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

@pytest.fixture()
def authenticated_user(client):
    headers = {
        'Content-Type': content_type,
        'Accept': content_type
    }
    test_json = {
        'username': random_string.generate(12),
        'password': random_string.generate(12)
    }
    client.post('/user', data=json.dumps(test_json), headers=headers)
    response = client.post('/auth', data=json.dumps(test_json), headers=headers)
    
    token = 'bearer '+ response.json['token']
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': token
    }
    user = client.get('/auth', json ={}, headers=headers)
    
    return {
        'id': user.json['id'],
        'username': user.json['username'],
        'token': token
    }