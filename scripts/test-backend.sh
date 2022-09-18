#! /bin/sh

export POSTGRES_USER='db'
export POSTGRES_PASSWORD='pass'
export POSTGRES_HOST='localhost'
export POSTGRES_PORT=5432
export POSTGRES_DB='db'
export SECRET_KEY='903900a2865fbcc43f5752851729f6ef'
export SQLALCHEMY_TRACK_MODIFICATIONS='True'
export DEBUG='True'
export FLASK_APP='__init__.py'

cd api && python3 -m pytest