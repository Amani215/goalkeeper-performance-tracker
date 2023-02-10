"""Redis related services"""
from config.redis import redis_db

NO_SUCH_KEY = 'No such key exists'


def add_item(key: str, new_value: str):
    '''Add an item to a redis key'''
    if redis_db.exists(key) > 0:
        redis_db.sadd(key, new_value)
        return redis_db.smembers(key)
    else:
        return {'error': NO_SUCH_KEY}


def get_items(key: str):
    '''Get items given the key'''
    if redis_db.exists(key) > 0:
        items = redis_db.smembers(key)
        res = []
        for item in items:
            res.append(item.decode("utf-8"))
        return res
    else:
        return {'error': NO_SUCH_KEY}


def delete_item(key: str, value: str):
    '''Delete an item from a set given its key'''
    if redis_db.exists(key) > 0:
        redis_db.srem(key, value)
        return redis_db.smembers(key)
    else:
        return {'error': NO_SUCH_KEY}
