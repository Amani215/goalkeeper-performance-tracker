"""This file initializes all the redis parameter tables to their default values"""
from config.redis import redis_db
import json
import os

default_file_path = os.getcwd() + 'default.json'
default_file = open('default.json', 'rt')
default_file_content = default_file.read()
defaults = json.loads(default_file_content)
default_file.close()

def load_table (name):
    """Initialize the table with the given name with the default values"""
    table = defaults[name]
    for item in table:
        redis_db.sadd(name,item)
        
def load_redis():
  """Load all the redis tables"""
  for key, value in defaults.items():
    load_table(key)
