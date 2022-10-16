'''Entry point of the API'''
import unittest
from flask import Flask
from config import Config
from config.postgres import db, migrate
from init.postgres_init import set_default_user
from init.redis_init import load_redis
from init.s3_init import create_buckets

def create_app():
    '''Create the app 
    
    (Application factory: https://flask.palletsprojects.com/en/2.2.x/patterns/appfactories/)
    '''
    app = Flask(__name__)

    app.config.from_mapping(Config)

    db.init_app(app)
    setup_database(db, app)
    migrate.init_app(app, db)
    load_redis()
    create_buckets()
    
    from route.user import user_api
    from route.auth import auth_api
    from route.category import category_api
    app.register_blueprint(user_api)
    app.register_blueprint(auth_api)
    app.register_blueprint(category_api)
    
    return app

def setup_database(_db, _app):
    '''Create the postgres database'''
    with _app.app_context():
        from model.user import User
        from model.category import Category
        _db.create_all()
        set_default_user()
        return _db

app = create_app()
app.app_context().push()

def run():
    app.run()

def test():
    '''Runs the unit tests.'''
    tests = unittest.TestLoader().discover('api/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

if __name__ == '__main__':
    run()
