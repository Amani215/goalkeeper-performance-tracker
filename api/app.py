'''Entry point of the API'''
from flask import Flask
from config import db, migrate
from config.sqlite import Config
from init.scheduler_init import scheduler
from init.postgres_init import set_default_user
from init.redis_init import load_redis
from init.s3_init import create_buckets


def create_app():
    '''Create the app 
    
    (Application factory: https://flask.palletsprojects.com/en/2.2.x/patterns/appfactories/)
    '''
    app = Flask(__name__, static_folder='./static', static_url_path='')

    app.config.from_mapping(Config)

    db.init_app(app)
    setup_database(db, app)
    migrate.init_app(app, db)
    load_redis()
    create_buckets()

    # Scheduler
    if not scheduler.running:
        scheduler.init_app(app)
        scheduler.start()

    # Import routes
    from route.health import health
    from route.user import user_api
    from route.auth import auth_api
    from route.category import category_api
    from route.goalkeeper import goalkeeper_api
    from route.match import match_api
    from route.match_monitoring import match_monitoring_api
    from route.match_sequence import match_sequence_api
    from route.training_session import training_session_api
    from route.training_monitoring import training_monitoring_api
    from route.growth_monitoring import growth_monitoring_api
    from route.settings import settings_api
    from route.document_generator import document_generator_api
    from route.planning import planning_api
    from route.calendar import calendar_api

    # Register routes as blueprints
    app.register_blueprint(health, url_prefix='/api')
    app.register_blueprint(user_api, url_prefix='/api')
    app.register_blueprint(auth_api, url_prefix='/api')
    app.register_blueprint(category_api, url_prefix='/api')
    app.register_blueprint(goalkeeper_api, url_prefix='/api')
    app.register_blueprint(match_api, url_prefix='/api')
    app.register_blueprint(match_monitoring_api, url_prefix='/api')
    app.register_blueprint(match_sequence_api, url_prefix='/api')
    app.register_blueprint(training_session_api, url_prefix='/api')
    app.register_blueprint(training_monitoring_api, url_prefix='/api')
    app.register_blueprint(growth_monitoring_api, url_prefix='/api')
    app.register_blueprint(settings_api, url_prefix='/api')
    app.register_blueprint(document_generator_api, url_prefix='/api')
    app.register_blueprint(planning_api, url_prefix='/api')
    app.register_blueprint(calendar_api, url_prefix='/api')

    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    @app.route('/docs')
    def docs_redirect():
        return app.redirect("/docs/", code=302)
    
    @app.route('/docs/')
    def docs_index():
        return app.send_static_file('docs/index.html')

    @app.route('/docs/<path:path>')
    def docs(path):
        if(path[-1]=='/'):
            return app.send_static_file(f'docs/{path}index.html')
        return app.send_static_file(f'docs/{path}')
 

    @app.errorhandler(404)   
    def not_found(e):   
        return app.send_static_file('index.html')

    return app


def setup_database(_db, _app):
    '''Create the database'''
    with _app.app_context():
        # Import models
        from model.user import User
        from model.category import Category
        from model.goalkeeper import Goalkeeper
        from model.match import Match
        from model.match_monitoring import match_monitoring
        from model.match_sequence import match_sequence
        from model.training_session import training_session
        from model.training_monitoring import training_monitoring
        from model.growth_monitoring import growth_monitoring
        from model.planning import Planning
        from model.calendar import Calendar
        from model.calendar_item import CalendarItem

        _db.create_all()
        set_default_user()
        return _db


app = create_app()

app.app_context().push()

if __name__ == '__main__':
    app.run()
