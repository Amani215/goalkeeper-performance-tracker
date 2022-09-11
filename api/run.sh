apk add build-base

apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev

python3 -m pip install -r requirements.txt && python3 -m flask run --host=0.0.0.0
