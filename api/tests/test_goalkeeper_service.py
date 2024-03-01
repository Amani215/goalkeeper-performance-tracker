'''Testing the goalkeeper services'''
import uuid
import random
import pytest
from model.goalkeeper import Goalkeeper
import service.category as category_service
import service.goalkeeper as goalkeeper_service
from helper import random_string, random_date

DATE_FORMAT = '%d/%m/%Y'

def test_add_goalkeeper(app):
    ''' Test adding goalkeeper '''

    goalkeepers = goalkeeper_service.get_goalkeepers()
    goalkeeper_count = len([i.serialize for i in goalkeepers])
    date = random_date.generate()
    goalkeeper = {
        'name': random_string.generate(12),
        'day': date.day,
        'month': date.month,
        'year': date.year
    }
    response = goalkeeper_service.add_goalkeeper(goalkeeper['name'],
                                                 goalkeeper['day'],
                                                 goalkeeper['month'],
                                                 goalkeeper['year'])

    goalkeepers = goalkeeper_service.get_goalkeepers()
    assert len([i.serialize for i in goalkeepers]) == goalkeeper_count + 1

    _goalkeeper: Goalkeeper = goalkeeper_service.get_by_id(response.id)

    assert _goalkeeper.name == goalkeeper['name']

    ### DUPLICATE USERNAME
    with pytest.raises(Exception):
        goalkeeper_service.add_goalkeeper(goalkeeper['name'],
                                          goalkeeper['day'],
                                          goalkeeper['month'],
                                          goalkeeper['year'])

    ### MIN - MAX FIELD


def test_get_goalkeepers(app):
    ''' Test getting all the goalkeepers in the database'''

    goalkeepers = goalkeeper_service.get_goalkeepers()
    assert len([i.serialize for i in goalkeepers]) == 0


def test_get_by_name(app, goalkeeper):
    ''' Test getting a goalkeeper by its name '''
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    assert _goalkeeper.name == goalkeeper['name']

    with pytest.raises(Exception):
        goalkeeper_service.get_by_name(random_string.generate(4))


def test_get_by_id(app, goalkeeper):
    ''' Test getting a goalkeeper by its id '''
    goalkeeper_id = goalkeeper_service.get_by_name(goalkeeper['name']).id
    _goalkeeper = goalkeeper_service.get_by_id(goalkeeper_id)

    assert _goalkeeper.name == goalkeeper['name']

    _goalkeeper = goalkeeper_service.get_by_id(str(uuid.uuid4()))
    assert 'error' in _goalkeeper


def test_add_category(app, goalkeeper):
    '''Test add a category to the trainer'''
    category = {
        'name': random_string.generate(12),
        'season': random.randint(1500, 2500)
    }
    category_response = category_service.add_category(category['name'],
                                                      category['season'])
    category = category_service.get_by_id(category_response.id)

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    response = goalkeeper_service.add_category(_goalkeeper, category)

    assert response['category_id'] == category.id


def test_update_params(app, goalkeeper):
    '''Test update of goalkeeper attributes'''
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])

    rand = random.randint(0, 100)
    response = goalkeeper_service.update_param(_goalkeeper.id, 'phone',
                                               str(rand))
    assert response.phone == str(rand)

    rand = random_date.generate()
    response = goalkeeper_service.update_param(_goalkeeper.id, 'birthday',
                                               str(rand.strftime(DATE_FORMAT)))
    assert response.birthday.strftime(DATE_FORMAT) == str(
        rand.strftime(DATE_FORMAT))
