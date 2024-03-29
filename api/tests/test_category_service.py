'''Testing the category services'''
import random
import uuid

import pytest
from helper import random_date, random_string
from model.category import Category
import service.category as category_service
import service.goalkeeper as goalkeeper_service
import service.user as user_service
from service.planning import add_planning
from service.calendar import add_calendar


def test_add_category(app):
    ''' Test adding category '''
    categories = category_service.get_categories()
    category_count = len([i.serialize for i in categories])
    category = {
        'name': random_string.generate(12),
        'season': str(random.randint(1500, 2500))
    }
    category_response = category_service.add_category(category['name'],
                                                      category['season'])

    categories = category_service.get_categories()
    assert len([i.serialize for i in categories]) == category_count + 1

    _category: Category = category_service.get_by_id(category_response.id)
    assert _category.name == category['name']
    assert _category.season == category['season']


def test_get_by_id(app):
    ''' Test getting a category by its id '''

    category = {
        'name':
        random_string.generate(12),
        'season':
        str(random.randint(1500, 2500)) + '-' + str(random.randint(1500, 2500))
    }
    category_id = category_service.add_category(category['name'],
                                                category['season']).id

    _category = category_service.get_by_id(category_id)
    assert _category.name == category['name']

    _category = category_service.get_by_id(str(uuid.uuid4()))
    assert 'error' in _category


def test_get_by_name(app):
    ''' Test getting categories by their name '''
    name1 = random_string.generate(12)
    name2 = random_string.generate(12)
    season1: str = str(random.randint(1500, 2500))
    season2: str = str(random.randint(1500, 2500)) + '/' + str(
        random.randint(1500, 2500))

    category_service.add_category(name1, season1)
    category_service.add_category(name1, season2)
    category_service.add_category(name2, season1)

    categories_name1 = category_service.get_by_name(name1)
    assert len([i.serialize for i in categories_name1]) == 2

    categories_name2 = category_service.get_by_name(name2)
    assert len([i.serialize for i in categories_name2]) == 1

    categories_no_name = category_service.get_by_name(
        random_string.generate(12))
    assert len([i.serialize for i in categories_no_name]) == 0


def test_get_by_season(app):
    ''' Test getting categories by their season '''
    name1 = random_string.generate(12)
    name2 = random_string.generate(12)
    season1: str = str(random.randint(1500, 2500)) + '/' + str(
        random.randint(1500, 2500))
    season2: str = str(random.randint(1500, 2500)) + '-' + str(
        random.randint(1500, 2500))

    category_service.add_category(name1, season1)
    category_service.add_category(name1, season2)
    category_service.add_category(name2, season1)

    categories_season1 = category_service.get_by_season(season1)
    assert len([i.serialize for i in categories_season1]) == 2

    categories_season2 = category_service.get_by_season(season2)
    assert len([i.serialize for i in categories_season2]) == 1

    categories_no_season = category_service.get_by_season(
        random.randint(1500, 2500))
    assert len([i.serialize for i in categories_no_season]) == 0


def test_get_by_archived(app, category):
    '''Test get categories given their archived attribute'''
    categories = category_service.get_by_archived(False)
    assert len([i.serialize for i in categories]) == 1

    categories = category_service.get_by_archived(True)
    assert len([i.serialize for i in categories]) == 0

    category_service.set_archived(category_id=category.id, archived=True)

    categories = category_service.get_by_archived(False)
    assert len([i.serialize for i in categories]) == 0

    categories = category_service.get_by_archived(True)
    assert len([i.serialize for i in categories]) == 1


def test_delete(app, category):
    '''Test deleting a category'''
    category_id = category.id

    category_service.delete(category_id)

    assert category_service.get_by_id(
        category_id)["error"] == "No row was found when one was required"


def test_delete_with_relationship(app, goalkeeper, category):
    '''Test deleting with category related to goalkeeper'''
    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    _category = category_service.get_by_id(category.id)

    goalkeeper_service.add_category(_goalkeeper, _category)

    with pytest.raises(PermissionError):
        category_service.delete(category.id)


def test_get_trainers(app, user, category):
    '''Test getting the list of trainers'''
    trainers = category_service.get_category_trainers(category_id=category.id)
    assert len(trainers) == 0

    user_service.add_category(user=user, category=category)
    trainers = category_service.get_category_trainers(category_id=category.id)
    assert len(trainers) == 1

    # INVALID INPUT
    response = category_service.get_category_trainers(
        category_id=random_string.generate(8))
    assert 'error' in response


def test_get_goalkeepers(app, goalkeeper, category):
    '''Test getting the list of goalkeepers'''
    goalkeepers = category_service.get_category_goalkeepers(
        category_id=category.id)
    assert len(goalkeepers) == 0

    _goalkeeper = goalkeeper_service.get_by_name(goalkeeper['name'])
    goalkeeper_service.add_category(goalkeeper=_goalkeeper, category=category)
    goalkeepers = category_service.get_category_goalkeepers(
        category_id=category.id)
    assert len(goalkeepers) == 1

    # INVALID INPUT
    response = category_service.get_category_goalkeepers(
        category_id=random_string.generate(8))
    assert 'error' in response


def test_get_plannings(app, category):
    '''Test get the plannings of a specific category'''
    assert len(category_service.get_plannings(category.id)) == 0

    add_planning(category.id,
                 random_date.generate().strftime('%d/%m/%Y'),
                 random_string.generate(6))
    add_planning(category.id,
                 random_date.generate().strftime('%d/%m/%Y'),
                 random_string.generate(5))

    assert len(category_service.get_plannings(category.id)) == 2


def test_get_calendars(app, calendar):
    '''Test get the calendars of a specific category'''
    cid = calendar.calendar_category.id
    assert len(category_service.get_calendars(cid)) == 1

    add_calendar(random_string.generate(5), cid)

    assert len(category_service.get_calendars(cid)) == 2


def test_set_archived(app, category):
    '''Test set the archived attribute'''
    assert category.archived == False
    category_service.set_archived(category.id, True)
    assert category.archived == True
