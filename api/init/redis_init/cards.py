"""Represents the cards table in redis"""
from config.redis import redis_db

def load (defaults):
    """Initialize the cards table with the default values"""
    cards = defaults["cards"]
    for card in cards:
        redis_db.sadd("cards",card)
