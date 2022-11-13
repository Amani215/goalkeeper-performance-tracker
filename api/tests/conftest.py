'''Reusable test items'''
import json
import os
import random
import pytest
from botocore.client import ClientError
from app import create_app
from config.postgres import db
from config.s3 import s3_client, s3_resource
from helper import random_string, random_date
import service.category as category_service
import service.user as user_service
import service.goalkeeper as goalkeeper_service
import service.match as match_service
import service.training_session as training_session_service
import service.growth_monitoring as growth_monitoring_service
import service.match_monitoring as match_monitoring_service
import service.training_monitoring as training_monitoring_service

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
def category():
    ''' Create a mock category '''
    category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category = category_service.add_category(category['name'],
                                             category['season'])
    return category


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
def goalkeeper():
    ''' Create a mock goalkeeper '''

    date = random_date.generate()
    goalkeeper_credentials = {
        'name': random_string.generate(12),
        'day': date.day,
        'month': date.month,
        'year': date.year,
    }
    goalkeeper_service.add_goalkeeper(goalkeeper_credentials['name'],
                                      goalkeeper_credentials['day'],
                                      goalkeeper_credentials['month'],
                                      goalkeeper_credentials['year'])
    return goalkeeper_credentials


@pytest.fixture()
def match():
    ''' Create a mock match '''

    date = random_date.generate()
    match_credentials = {
        'date': date.strftime('%d/%m/%Y'),
        'local': random_string.generate(4),
        'visitor': random_string.generate(4),
        'match_type': random_string.generate(4)
    }
    _match = match_service.add_match(match_credentials['date'],
                                     match_credentials['visitor'],
                                     match_credentials['local'],
                                     match_credentials['match_type'])
    return _match


@pytest.fixture()
def match_monitoring(goalkeeper, match):
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    goalkeeper_category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    goalkeeper_category = category_service.add_category(
        goalkeeper_category['name'], goalkeeper_category['season'])
    goalkeeper_service.add_category(_goalkeeper, goalkeeper_category)

    match_category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    match_category = category_service.add_category(match_category['name'],
                                                   match_category['season'])
    match_service.set_category(match, match_category)

    match_monitoring_obj = match_monitoring_service.add_match_monitoring(
        str(_goalkeeper.id), str(match.id))
    return match_monitoring_obj


@pytest.fixture()
def training_session(category):
    ''' Create a mock training session '''

    date = random_date.generate_with_time()
    training_session_credentials = {
        'date': date.strftime('%d/%m/%Y %H:%M'),
        'duration': random.randint(0, 500),
        'category_id': category.id
    }
    _training = training_session_service.add_training_session(
        training_session_credentials['date'],
        training_session_credentials['duration'],
        training_session_credentials['category_id'])
    return _training


@pytest.fixture()
def training_monitoring(goalkeeper, training_session):
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    goalkeeper_category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    goalkeeper_category = category_service.add_category(
        goalkeeper_category['name'], goalkeeper_category['season'])
    goalkeeper_service.add_category(_goalkeeper, goalkeeper_category)

    session_category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    session_category = category_service.add_category(
        session_category['name'], session_category['season'])
    training_session_service.update_category(str(training_session.id),
                                             str(session_category.id))

    training_monitoring_obj = training_monitoring_service.add_training_monitoring(
        str(_goalkeeper.id), str(training_session.id))
    return training_monitoring_obj


@pytest.fixture()
def growth_monitoring(goalkeeper):
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    date = random_date.generate()

    growth_monitoring_obj = growth_monitoring_service.add_growth_monitoring(
        _goalkeeper.id, date.strftime('%d/%m/%Y'))

    return growth_monitoring_obj


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
