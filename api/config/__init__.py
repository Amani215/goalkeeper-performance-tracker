import os

Config = {
    'SECRET_KEY': os.getenv('SECRET_KEY'),
    'DEBUG': os.getenv('DEBUG'),
    'SQLALCHEMY_DATABASE_URI': f'postgresql://{os.getenv("POSTGRES_USER")}:{os.getenv("POSTGRES_PASSWORD")}@{os.getenv("POSTGRES_HOST")}:{os.getenv("POSTGRES_PORT")}/{os.getenv("POSTGRES_DB")}',
    'SQLALCHEMY_TRACK_MODIFICATIONS':os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
}
