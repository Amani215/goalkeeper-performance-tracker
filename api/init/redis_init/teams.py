"""Represents the teams table in redis"""
from config.redis import redis_db

def load (defaults):
    """Initialize the cards table with the default values"""
    teams = defaults["teams"]
    for team in teams:
        redis_db.sadd("teams",team)