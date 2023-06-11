"""App config with sqlite as main db solution"""
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

Config = {
    'SECRET_KEY': os.getenv('SECRET_KEY'),
    'DEBUG': os.getenv('DEBUG'),
    'SQLALCHEMY_DATABASE_URI': f'sqlite://{os.getenv("SQLITE_HOST")}',
    'SQLALCHEMY_TRACK_MODIFICATIONS':
    os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS'),
    'SCHEDULER_API_ENABLED': True
}