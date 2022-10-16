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
        'season': random.randint(1500,2500)
    }
    category_response=category_service.add_category(category['name'], category['season'])
    
    categories = category_service.get_categories()
    assert len([i.serialize for i in categories]) == category_count+1
    
    _category:Category = category_service.get_by_id(category_response['category_id'])
    assert _category.name == category['name']
    assert _category.season == category['season']

def test_get_by_id(app):
    ''' Test getting a category by its id '''
    
    category = {
        'name': random_string.generate(12),
        'season': random.randint(1500,2500)
    }
    category_id = category_service.add_category(category['name'], category['season'])['category_id']
    
    _category = category_service.get_by_id(category_id)
    assert _category.name == category['name']
    
    _category = category_service.get_by_id(str(uuid.uuid4()))
    assert 'error' in _category

def test_get_by_id(app):
    ''' Test getting categories by their name '''
    name1=random_string.generate(12)
    name2=random_string.generate(12)
    season1=random.randint(1500,2500)
    season2=random.randint(1500,2500)
    
    category11 = {
        'name': name1,
        'season': season1
    }
    category_service.add_category(category11['name'], category11['season'])
    
    category12 = {
        'name': name1,
        'season': season2
    }
    category_service.add_category(category12['name'], category12['season'])
    
    category21 = {
        'name': name2,
        'season': season1
    }
    category_service.add_category(category21['name'], category21['season'])
    
    categories_name1 = category_service.get_by_name(name1)
    assert len([i.serialize for i in categories_name1]) == 2
    
    categories_name2 = category_service.get_by_name(name2)
    assert len([i.serialize for i in categories_name2]) == 1
    
    categories_no_name = category_service.get_by_name(random_string.generate(12))
    assert len([i.serialize for i in categories_no_name]) == 0