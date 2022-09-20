"""Imports"""
import unittest
from flask import Flask
from flask_wtf.csrf import CSRFProtect
from model import db
from config import Config

csrf = CSRFProtect()

def create_app():
    """Create the app 
    
    (Application factory: https://flask.palletsprojects.com/en/2.2.x/patterns/appfactories/)
    """
    app = Flask(__name__)
    
    # Preventing CSRF
    csrf.init_app(app)
    
    app.config.from_mapping(Config)
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
        _db.create_all()
        return _db
    
app = create_app()
app.app_context().push()

def run():
    app.run()

def test():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('api/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

if __name__ == '__main__':
    run()
