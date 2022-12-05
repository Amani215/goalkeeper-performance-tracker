'''Entry point of the API'''
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

    # Import routes
    from route.user import user_api
    from route.auth import auth_api
    from route.category import category_api
    from route.goalkeeper import goalkeeper_api
    from route.match import match_api
    from route.match_monitoring import match_monitoring_api
    from route.training_session import training_session_api
    from route.training_monitoring import training_monitoring_api
    from route.growth_monitoring import growth_monitoring_api

    # Register routes as blueprints
    app.register_blueprint(user_api)
    app.register_blueprint(auth_api)
    app.register_blueprint(category_api)
    app.register_blueprint(goalkeeper_api)
    app.register_blueprint(match_api)
    app.register_blueprint(match_monitoring_api)
    app.register_blueprint(training_session_api)
    app.register_blueprint(training_monitoring_api)
    app.register_blueprint(growth_monitoring_api)

    return app


def setup_database(_db, _app):
    '''Create the postgres database'''
    with _app.app_context():
        # Import models
        from model.user import User
        from model.category import Category
        from model.goalkeeper import Goalkeeper
        from model.match import Match
        from model.match_monitoring import match_monitoring
        from model.training_session import training_session
        from model.training_monitoring import training_monitoring
        from model.growth_monitoring import growth_monitoring
        
        _db.create_all()
        set_default_user()
        return _db


app = create_app()

app.app_context().push()
