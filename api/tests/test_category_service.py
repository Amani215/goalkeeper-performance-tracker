'''Testing the category services'''
import random
import uuid
from helper import random_string
from model.category import Category
import service.category as category_service


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
    season1 = str(random.randint(1500, 2500))
    season2 = str(random.randint(1500, 2500)) + '/' + str(
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
    season1 = str(random.randint(1500, 2500)) + '/' + str(
        random.randint(1500, 2500))
    season2 = str(random.randint(1500, 2500)) + '-' + str(
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


def test_delete(app, category):
    '''Test deleting a category'''
    category_id = category.id

    category_service.delete(category_id)

    assert category_service.get_by_id(
        category_id)["error"] == "No row was found when one was required"
