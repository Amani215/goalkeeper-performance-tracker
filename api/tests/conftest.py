'''Reusable test items'''
import json
import os
import pytest
from botocore.client import ClientError
from app import create_app
from config.postgres import db
from config.s3 import s3_client, s3_resource
from helper import random_string
import service.user as user_service

content_type = 'application/json'
AUTH_ROUTE = '/auth'


@pytest.fixture()
def app():
    '''Create a mock app instance'''
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
    '''Create a test bucket'''
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
        print('error:', err)


@pytest.fixture()
def user():
    ''' Create a mock user '''
    user_credentials = {
        'username': random_string.generate(12),
        'password': random_string.generate(12),
        'admin': False
    }
    user_service.add_user(user_credentials['username'],
                          user_credentials['password'],
                          user_credentials['admin'])
    return user_credentials


@pytest.fixture()
def authenticated_user(client, admin: bool):
    # Login as admin
    headers = {'Content-Type': content_type, 'Accept': content_type}
    test_json = {
        'username': os.getenv('ADMIN_USERNAME'),
        'password': os.getenv('ADMIN_PASSWORD')
    }
    admin_response = client.post(AUTH_ROUTE,
                                 data=json.dumps(test_json),
                                 headers=headers)
    admin_token = 'bearer ' + admin_response.json['token']

    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': admin_token
    }

    if (admin):
        user = client.get(AUTH_ROUTE, json={}, headers=headers)
        return {
            'id': user.json['id'],
            'username': user.json['username'],
            'token': admin_token
        }

    # Login as another user
    test_json = {
        'username': random_string.generate(12),
        'password': random_string.generate(12),
        'admin': admin
    }
    client.post('/user', data=json.dumps(test_json), headers=headers)
    response = client.post(AUTH_ROUTE,
                           data=json.dumps(test_json),
                           headers=headers)

    token = 'bearer ' + response.json['token']
    headers = {
        'Content-Type': content_type,
        'Accept': content_type,
        'Authorization': token
    }
    user = client.get(AUTH_ROUTE, json={}, headers=headers)

    return {
        'id': user.json['id'],
        'username': user.json['username'],
        'token': token
    }
