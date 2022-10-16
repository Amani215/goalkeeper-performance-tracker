"""This file initializes all the redis parameter tables to their default values"""
import init.redis_init.cards as cards
import init.redis_init.teams as teams
import json
import os

default_file_path = os.getcwd() + 'default.json'
default_file = open('default.json', 'rt')
default_file_content = default_file.read()
defaults = json.loads(default_file_content)
default_file.close()

def load_redis():
  """Load all the redis tables"""
  cards.load(defaults)
  teams.load(defaults)
