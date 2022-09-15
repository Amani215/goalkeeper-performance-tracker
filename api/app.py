"""Imports"""
import os.path
from dotenv import load_dotenv
from flask import Flask

def create_app():
    """Create the app 
    
    (Application factory: https://flask.palletsprojects.com/en/2.2.x/patterns/appfactories/)
    """
    app = Flask(__name__)

    load_dotenv()
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
    app.config['SECRET_KEY']=os.getenv('SECRET_KEY')

    from model import db
    db.init_app(app)
    setup_database(db, app)
    
    from route.user import user_api
    from route.auth import auth_api
    app.register_blueprint(user_api)
    app.register_blueprint(auth_api)
    
    return app

def setup_database(db, _app):
    """Create the postgres database"""
    with _app.app_context():
        # db.drop_all()
        db.create_all()
        return db

_app = create_app()
_app.run()
