"""Imports"""
import imp
from flask import Flask
from model import db
from config.config import config_by_name

def create_app(config_name):
    """Create the app 
    
    (Application factory: https://flask.palletsprojects.com/en/2.2.x/patterns/appfactories/)
    """
    app = Flask(__name__)

    app.config.from_object(config_by_name[config_name])

    db.init_app(app)
    setup_database(db, app)
    
    from route.user import user_api
    from route.auth import auth_api
    app.register_blueprint(user_api)
    app.register_blueprint(auth_api)
    
    return app

def setup_database(_db, _app):
    """Create the postgres database"""
    with _app.app_context():
        from model.user import User
        # db.drop_all()
        _db.create_all()
        return _db

_app = create_app('dev')
_app.run()
