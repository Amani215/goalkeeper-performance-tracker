#! /bin/sh

# POSTGRES TEST ENVIRONMENT VARIABLES
export POSTGRES_USER='db'
export POSTGRES_PASSWORD='pass'
export POSTGRES_HOST='localhost'
export POSTGRES_PORT=5432
export POSTGRES_DB='db'
export SQLITE_HOST='/../db/test.db'
export SECRET_KEY='903900a2865fbcc43f5752851729f6ef'
export SQLALCHEMY_TRACK_MODIFICATIONS='True'
export DEBUG='True'
export FLASK_APP='__init__.py'
export TOKEN_EXPIRY_IN_SEC='60'

# S3 TEST ENVIRONMENT VARIABLES
export AWS_DEFAULT_REGION='eu-central-1'
export AWS_DOMAIN='http://localhost:9000'
export AWS_ACCESS_KEY_ID='myminioadmin'
export AWS_SECRET_ACCESS_KEY='minio-secret-key-change-me'
export PROFILE_PICS_BUCKET='test-profile-pics'
export GOALKEEPER_PICS_BUCKET='test-goalkeeper-pics'
export TRAINING_FORMS_BUCKET='test-training-forms'
export DOCUMENTS_BUCKET='test-documents'
export PUBLIC_S3='http://localhost:9000'

# REDIS TEST ENVIRONMENT VARIABLES
export REDIS_HOST='localhost'
export REDIS_PORT=6379
export REDIS_CACHE_TTL=60 

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