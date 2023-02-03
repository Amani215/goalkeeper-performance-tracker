"""App config with sqlite as main db solution"""
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

basedir = os.path.abspath(os.path.dirname(__file__))
db_host = f'../db/{os.getenv("POSTGRES_DB")}'  # No need for different names

Config = {
    'SECRET_KEY': os.getenv('SECRET_KEY'),
    'DEBUG': os.getenv('DEBUG'),
    'SQLALCHEMY_DATABASE_URI': f'sqlite:///{os.path.join(basedir, db_host)}',
    'SQLALCHEMY_TRACK_MODIFICATIONS':
    os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
}

db = SQLAlchemy()
migrate = Migrate()