"""Imports"""
import os.path
from dotenv import load_dotenv
from flask import Flask
from model import db
from route.user import user_api
from route.auth import auth_api

def create_app():
    """Create the app"""
    app = Flask(__name__)

    load_dotenv()
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
    app.config['SECRET_KEY']=os.getenv('SECRET_KEY')

    db.init_app(app)
    app.register_blueprint(user_api)
    app.register_blueprint(auth_api)
    return app

def setup_database(_app):
    """Create the postgres database"""
    with _app.app_context():
        # db.drop_all()
        db.create_all()

_app = create_app()
setup_database(_app)
_app.run()
