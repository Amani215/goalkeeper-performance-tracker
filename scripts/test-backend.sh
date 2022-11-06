#! /bin/sh

# POSTGRES TEST ENVIRONMENT VARIABLES
export POSTGRES_USER='db'
export POSTGRES_PASSWORD='pass'
export POSTGRES_HOST='localhost'
export POSTGRES_PORT=5432
export POSTGRES_DB='db'
export SECRET_KEY='903900a2865fbcc43f5752851729f6ef'
export SQLALCHEMY_TRACK_MODIFICATIONS='True'
export DEBUG='True'
export FLASK_APP='__init__.py'

# S3 TEST ENVIRONMENT VARIABLES
export AWS_DEFAULT_REGION='eu-central-1'
export AWS_DOMAIN='http://localhost:9000'
export AWS_ACCESS_KEY_ID='myminioadmin'
export AWS_SECRET_ACCESS_KEY='minio-secret-key-change-me'
export PROFILE_PICS_BUCKET='test-profile-pics'
export GOALKEEPER_PICS_BUCKET='test-goalkeeper-pics'

# REDIS TEST ENVIRONMENT VARIABLES
export REDIS_HOST='localhost'
export REDIS_PORT=6379

### DEFAULT USER ###
export ADMIN_USERNAME='test_user'
export ADMIN_PASSWORD='test_password'

rm -rf ./api/coverage.xml
cd api && python3 -m pytest --cov-report=term --cov=. tests/
# cd api && python3 -m pytest tests/

for file in ./api/.coverage.*
do
    rm -rf $file;
    done
rm -rf .coverage