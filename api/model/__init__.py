"""importing the models"""
from flask_sqlalchemy import SQLAlchemy
from flask_s3 import FlaskS3
from flask_migrate import Migrate

db = SQLAlchemy()
s3 = FlaskS3()
migrate = Migrate()