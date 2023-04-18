"""This file initializes all the redis parameter tables to their default values"""
from config.redis import redis_db
import json


def get_tables():
    default_file = open('default.json', 'rt')
    default_file_content = default_file.read()
    defaults = json.loads(default_file_content)
    default_file.close()
    return defaults


def load_table(name, defaults):
    """Initialize the table with the given name with the default values"""
    table = defaults[name]
    for item in table:
        redis_db.sadd(name, item)


def load_redis():
    """Load all the redis tables"""
    defaults = get_tables()
    for key, value in defaults.items():
        load_table(key, defaults)
